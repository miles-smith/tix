# Tix Demo App

## Description

Demo application exploring microservices and k8s.

## Getting Started

### Dependencies

* Docker
* Kubernetes
* Node JS (14.x)

### Executing program

#### Install/Configure Kubernetes ingress controller
Web traffic to the Kubernetes cluster requires an ingress controller to be configured, such as [ingress-nginx](https://github.com/kubernetes/ingress-nginx). Other alternatives are available. Refer to first party documentation on setting up.

#### Configure DNS
The application expects to route traffic based on an `application.local` domain/host. You can add an entry to your `/etc/hosts` file (or equivalent) to map `application.local` to `localhost` or `127.0.0.1`. Alternatively, edit the `host` value in the `infrastructure/k8s/ingress-srv.yml` file.

#### Secrets
Some services within the application are reliant upon API keys and/or other secrets; these are managed via Kubernetes secrets and should be provided/configured ahead of time:
```
kubectl create secret generic jwt-key --from-literal="JWT_KEY=<key>"
kubectl create secret generic stripe-key --from-literal="STRIPE_PUBLISHABLE_KEY=<key>"
kubectl create secret generic stripe-secret --from-literal="STRIPE_KEY=<key>"
```

#### Launch application/services
For the sake of simplicity, this project uses [Skaffold](https://skaffold.dev) to manage building and deploying Docker images to a (local) Kubernetes cluster. To launch the application/services, navigate to the root of the project and execute:
```
skaffold dev
```

Once all of the services are bootstrapped, you should now be able to navigate a browser to `https://applicaton.local` to view the NextJS client. Note that your browser will/may present certificate errors/warnings.

## Version History

See CHANGELOG.md

## License

This project is licensed under the ISC License - see the LICENSE.md file for details

## Acknowledgments

* [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react)
* [Stephen Grider](https://github.com/stephengrider)
