DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tombodb') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE tombodb');
    END IF;
END $$;
