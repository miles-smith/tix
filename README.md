# Tix Demo App

## Description

Demo application exploring microservices and k8s.

## Getting Started

### Dependencies

* Docker
* Kubernetes
* Node JS (14.x)

### Executing program

For the sake of simplicity, this project uses [Skaffold](https://skaffold.dev) to manage building and deploying Docker images to a (local) Kubernetes cluster. To launch the various services, navigate to the root of the project and execute:
```
skaffold dev
```

Some applications in the cluster are relient upon API keys and/or other secrets; these are managed via Kubernetes secrets and should be provided/configured before launching the services.
```
kubectl create secret generic jwt-key --from-literal="JWT_KEY=<key>"
kubectl create secret generic stripe-key --from-literal="STRIPE_PUBLISHABLE_KEY=<key>"
kubectl create secret generic stripe-secret --from-literal="STRIPE_KEY=<key>"
```

## Version History

See CHANGELOG.md

## License

This project is licensed under the ISC License - see the LICENSE.md file for details

## Acknowledgments

* [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react)
* [Stephen Grider](https://github.com/stephengrider)
