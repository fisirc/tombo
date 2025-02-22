# Setup a multi-node Kubernetes cluster with minkube

Follow these instructions to setup a [kind](https://kind.sigs.k8s.io/) cluster accessible from the
public internet.

## Creating the cluster

Replace `PUBLIC_IP` with your server's public IP address.

```bash
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: kind
networking:
  apiServerAddress: PUBLIC_IP
nodes:
- role: control-plane
- role: control-plane
- role: control-plane
- role: worker
- role: worker
- role: worker
EOF
```

I had to run this command multiple times along with `docker network rm kind` to get
this to work.

> See the [kind configuration](https://kind.sigs.k8s.io/docs/user/configuration/) docs.
>
> Note that publicly exposing your kind cluster is strongly discouraged
> by the [Security Goose](https://kind.sigs.k8s.io/docs/user/configuration/#api-server),
> but what do gooses know about security?

If the HA setup is not working for you, you may want to start a single control-plane
topology and removing the NoSchedule taint for it.

```bash
kubectl taint nodes kind-control-plane node-role.kubernetes.io/control-plane:NoSchedule-
```

Verify the nodes by running:

```bash
$ kubectl get nodes -owide
NAME                  STATUS   ROLES           AGE     VERSION   INTERNAL-IP
kind-control-plane    Ready    control-plane   4m39s   v1.32.2   172.18.0.5
kind-control-plane2   Ready    control-plane   4m31s   v1.32.2   172.18.0.3
kind-control-plane3   Ready    control-plane   4m23s   v1.32.2   172.18.0.8
kind-worker           Ready    <none>          4m14s   v1.32.2   172.18.0.7
kind-worker2          Ready    <none>          4m14s   v1.32.2   172.18.0.4
kind-worker3          Ready    <none>          4m14s   v1.32.2   172.18.0.6
```

## Remotely accessing the cluster with kubectl

Kind creates a ready-to-use kube config file in `~/.kube/config`. All you
will need to do is to copy it to your local machine.

```bash
# For example with scp
scp your-remote-vps:~/.kube/config ~/.kube/config
```

And use it to access your cluster with `kubectl`:

```bash
export KUBECONFIG=/path/to/kubeconfig
kubectl cluster-info
```

The GitHub actions reads this config from the `KUBECONFIG` secret. You must
base64 encode the file before adding it to the repository.

```bash
cat kubeconfig | base64 -w 0 | xclip -selection clipboard
```

Note that in HA setups this config has `clusters[0].cluster.server` pointing
to an special `kind-external-load-balancer` container.
Verify this by running `kubectl config view` and `docker ps`.

## Installing Helm and the Charts

Download the appropriate Helm release <https://github.com/helm/helm/releases> in your VPS.

```bash
# See https://helm.sh/docs/intro/install/#from-the-helm-project

wget https://get.helm.sh/helm-v3.17.1-linux-amd64.tar.gz
tar -zxvf helm-v3.17.1-linux-amd64.tar.gz
mv linux-amd64/helm .local/bin/
```

### Adding the Helm Chart dependencies

The following Charts are required to setup the cluster:

**cert-manager** [[guide](<https://artifacthub.io/packages/helm/cert-manager/cert-manager#installing-the-chart>)]

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.1/cert-manager.crds.yaml
helm repo add jetstack https://charts.jetstack.io --force-update

helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.17.1
```

## Configure your Nginx Ingress

Deploy your Nginx ingress by running:

```bash
kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml
# See https://kind.sigs.k8s.io/docs/user/ingress/
```

By default this ingress has no replicas, so the controller will only be
accessible in the node it was scheduled. Trying to reach your service from
another worker will fail.

```bash
# Setup a Deployment + Service + Ingress and you will get the following

curl http://172.18.0.7.2:80/service  # works       (kind-worker)
curl http://172.18.0.4.3:80/service  # unreachable (kind-worker2)
curl http://172.18.0.6.4:80/service  # unreachable (kind-worker3)
```

If you know your Kubernetes (and I'm sure you do 🌻), you might be thinking
that our `service` is indeed reachable from any node!. And this is because how
this specific Nginx distribution sets up its Service.

The Nginx configuration provided by Kind creates a Service of type
`NodePort` that exposes the Deployment at a cluster level. So if you know the
Service `nodePort` you can access our `service` from any node and still
using our Ingress rules.

```bash
$ kubectl get svc -n ingress-nginx ingress-nginx-controller

NAME                                 TYPE        CLUSTER-IP      PORT(S)
ingress-nginx-controller             NodePort    10.96.127.242   80:31325/TCP,443:30301/TCP

$ curl http://172.18.0.7.2:31325/service  # works! (kind-worker)
$ curl http://172.18.0.4.3:31325/service  # works! (kind-worker2)
$ curl http://172.18.0.6.4:31325/service  # works! (kind-worker3)
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
      # And remove the "primary" nodeSelector constraint (if exists)
      nodeSelector:
        kubernetes.io/os: linux
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

## Load balancing the nodes traffic

In previous steps we used Nginx as a reverse proxy to route traffic from our
VPS to the `kube-api-server` running on the primary node.

The same idea can be applied to balance HTTP/HTTPS traffic to our worker nodes.

The resulting configuration will look like this:

```nginx
stream {
    # kube-api-server
    server {
        listen 8443;
        proxy_pass 192.168.49.2:8443;
    }

    # proxy for http pods
    upstream worker_nodes_http {
        least_conn;
        server 192.168.49.2:80 max_fails=3 fail_timeout=5s;
        server 192.168.49.3:80 max_fails=3 fail_timeout=5s;
        server 192.168.49.4:80 max_fails=3 fail_timeout=5s;
    }
    server {
        listen 80;
        proxy_pass worker_nodes_http;
    }

    # proxy for https pods
    upstream worker_nodes_https {
        least_conn;
        server 192.168.49.2:443 max_fails=3 fail_timeout=5s;
        server 192.168.49.3:443 max_fails=3 fail_timeout=5s;
        server 192.168.49.4:443 max_fails=3 fail_timeout=5s;
    }
    server {
        listen 443;
        proxy_pass worker_nodes_https;
    }
}
```

And use docker-compose to start the Nginx container:

```yaml
services:
  nginx:
    image: nginx:1.27.4-alpine
    network_mode: "host"
    volumes:
      - /path/to/nginx.conf:/etc/nginx/nginx.conf:ro
```

You can get a default config by runnning

```bash
docker run --rm --entrypoint=cat nginx /etc/nginx/nginx.conf > nginx.conf
```

## Minio setup

Create a bucket called "reports" with the following Access Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::reports/*"]
    }
  ]
}
```

That will enable public read access to the objects in the bucket.

## Side notes

For the minikube version of this guide see
[ddff827](https://github.com/fisirc/tombo/blob/ddff827d244f8a7db59616381cad6b92f1818250/k8s/README.md).
