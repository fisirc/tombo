# Setup a multi-node Kubernetes cluster with minkube

Follow these instructions to setup a minikube cluster accessible from the
public internet.

## Creating the cluster

Note that the following with create your cluster under the "minikube" profile
if you did not specify one before.

Replace `PUBLIC_IP` with your server's public IP address.

```bash
minikube start \
  --driver=docker \
  --addons=ingress \
  --memory=14g \
  --cpus=max \
  --nodes 3 \
  --disk-size=50000mb \
  --apiserver-ips=PUBLIC_IP
```

Verify the nodes by running:

```bash
$ kubectl get nodes -owide

NAME           STATUS   ROLES           AGE   VERSION   INTERNAL-IP
minikube       Ready    control-plane   69s   v1.32.0   192.168.49.2
minikube-m02   Ready    <none>          69s   v1.32.0   192.168.49.3
minikube-m03   Ready    <none>          69s   v1.32.0   192.168.49.4
```

## Allowing internet traffic

Unless you use `--driver=none`, your cluster will not be accessible from your
public IP as the nodes are Docker containers running on an isolated network.

This is an expected behavior. You can now use your VPS as a reverse proxy to
route traffic to your cluster and load balance your worker nodes.

Create a `nginx.conf` file with the following content:

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

stream {
  server {
    listen 8443;
    proxy_pass CONTROL_PLANE_IP:8443;
  }
}
```

> In the output of the previous step we see that our `CONTROL_PLANE_IP` is
> `192.168.49.2`.

And use docker-compose to start the Nginx container:

```yaml
services:
  nginx:
    image: nginx:1.27.4-alpine
    network_mode: "host"
    volumes:
      - /path/to/nginx.conf:/etc/nginx/nginx.conf:ro
```

In a nutshell, this configuration will route traffic from your VPS public IP
to your `kube-api-server` running at `CONTROL_PLANE_IP:8443`.

You can extend this configuration as your needs grow. In the future I will try
to update this to support High Availability topology and Load Balancing of
worker nodes.

## Remotely accessing the cluster

Create your KUBECONFIG file using `~/.kube/config` as base

```bash
cat ~/.kube/config
```

Change the following keys in your config file

- `clusters[0].cluster.certificate-authority`
- `users[0].user.client-certificate`
- `users[0].user.client-key`

For the following keys, respectively:

- `cluster.certificate-authority-data`
- `user.client-certificate-data`
- `user.client-key-data`

And encode the values with the following commands:

```bash
cat ~/.minikube/ca.crt | base64 -w 0
cat ~/.minikube/profiles/minikube/client.crt | base64 -w 0
cat ~/.minikube/profiles/minikube/client.key | base64 -w 0
```

And the `clusters[0].cluster.server` should be changed to the public IP of
your server.

Now you can use that kubeconfig file to access your cluster remotely.

```bash
export KUBECONFIG=/path/to/kubeconfig
kubectl cluster-info
```

The GitHub actions reads this config from the `KUBECONFIG` secret. You must
base64 encode the file before adding it to the repository.

```bash
cat kubeconfig | base64 -w 0 | xclip -selection clipboard
```

## Configure your Nginx Ingress

In the first step we already added the Nginx addon to our cluster. If you forgot
to do so, enable it with.

```bash
minikube addons enable ingress
```

After a hard debugging session, I found out that the Nginx Ingress controller
has only one replica with its node selector set to:

```yaml
# Inspect this yourself by running
# kubectl edit -n ingress-nginx deployments.apps ingress-nginx-controller

apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  replicas: 1
  template:
    spec:
      containers:
      - nodeSelector:
          kubernetes.io/os: linux
          minikube.k8s.io/primary: "true"

# (Only relevant parts are shown)
```

Even if you increase the number of replicas to match the number of nodes,
because of the
[`nodeSelector`](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
constraint the pods will only select the primary node, and the replicas will
not be scheduled because of port conflicts (specifically ports 80 and 443).

```bash
# Setup a Deployment + Service + Ingress and you will get the following

curl http://192.168.49.2:80/service  # works       (minikube)
curl http://192.168.49.3:80/service  # unreachable (minikube-m02)
curl http://192.168.49.4:80/service  # unreachable (minikube-m03)
```

If you know your Kubernetes (and I'm sure you do 🌻), you might be thinking
that our `service` is indeed reachable from any node!. And this is because how
this specific Nginx distribution sets up its Service.

The Nginx configuration provided by minikube creates a Service of type
`NodePort` that exposes the Deployment at a cluster level. So if you know the
Service `nodePort` you can access our `service` from any node and still
using our Ingress rules.

```bash
$ kubectl get svc -n ingress-nginx ingress-nginx-controller

NAME                                 TYPE        CLUSTER-IP      PORT(S)
ingress-nginx-controller             NodePort    10.96.127.242   80:31325/TCP,443:30301/TCP

$ curl http://192.168.49.2:31325/service  # works! (minikube)
$ curl http://192.168.49.3:31325/service  # works! (minikube-m02)
$ curl http://192.168.49.4:31325/service  # works! (minikube-m03)
```

However using the `NodePort` directly completely defeats the purpose of having
the Ingress Controller behind a Service.

We will solve this by replicating the `ingress-nginx-controller` with one pod
per node.

And to achieve this we will need to manually edit our Ingress Controller Service
spec to:

- Increase the replicas to match our number of nodes
- Remove the `nodeSelector` constraint
- Setup an affinity rule so that each replica is scheduled on a different node

I did not find a solution to do this programmatically (suggestions are welcome)
so you will need to manually edit the Deployment manifest following the steps
below.

```bash
kubectl edit -n ingress-nginx deployments.apps ingress-nginx-controller
```

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  # Number of nodes of your cluster
+ replicas: 3
  # ...
  template:
    spec:
      # Add the following spread constraint
+     topologySpreadConstraints:
+       - labelSelector:
+           matchLabels:
+             app.kubernetes.io/component: controller
+             app.kubernetes.io/name: ingress-nginx
+         maxSkew: 1
+         topologyKey: kubernetes.io/hostname
+         whenUnsatisfiable: DoNotSchedule
      # And remove the nodeSelector
-     nodeSelector:
-       kubernetes.io/os: linux
-       minikube.k8s.io/primary: "true"

# (Only relevant parts are shown)
```

Here are the values so you can copy and paste them:

```yaml
spec:
  template:
    spec:
      topologySpreadConstraints:
        - labelSelector:
            matchLabels:
              app.kubernetes.io/component: controller
              app.kubernetes.io/name: ingress-nginx
          maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
```

The `topologySpreadConstraints` rule is used to spread the pods across the
nodes of the cluster. The `topologyKey` is set to `kubernetes.io/hostname` so
that each pod is scheduled on a different node.

An alternative solution would be to deploy the ingress as a DaemonSet.
See <https://github.com/kubernetes/ingress-nginx/tree/main/charts/ingress-nginx>
