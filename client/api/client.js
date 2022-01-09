import axios from 'axios';

// Since we're trying to communicate from within our pods/containers to other pods/containers
// we should route the traffic via the ingress. We have to use cross namespace service communication
// here since the Nginx ingress is organised in a different k8s namespace.
// Sure, we could use our cluster IP services to achieve the same goal, but that only serves to
// increase coupling, is likely going to end up a maintenance nightmare, and be potentially fragile.
//
// `window` is an object that only exists within a browser; we can use this to determine if
// we are executing code client or servier side. There used to be a handy function within NextJS
// to do just this but it was deprecated.
export const apiClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
}
