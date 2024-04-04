const development_domain_server =
  "https://sr-itc-dev-api-hcr64pytia-uc.a.run.app/api/v1/";
// const development_domain_server = "http://192.168.1.39:5000/api/v1/";
// const development_domain_server =
//   "https://itc-api-hcr64pytia-uc.a.run.app/api/v1/";
// const development_domain_server =
//   "https://tempitc-production.up.railway.app/api/v1/";
const development_path_server = "";




const production_domain_server =
  "https://itc-api-hcr64pytia-uc.a.run.app/api/v1/";
// "https://itc-api-hcr64pytia-uc.a.run.app/api/v1/";
const production_path_server = "";

const development = {
  apiGateway: {
    URL: development_domain_server + development_path_server,
    imgSrc: "http://localhost/lapiastore-api/public/",
  },
  firebase_config: {
    databaseURL: "https://saferoad-srialfb.firebaseio.com",
    databaseURLDues: "https://saferoad-dues.firebaseio.com",
  },
};

const production = {
  apiGateway: {
    URL: production_domain_server + production_path_server,
    imgSrc: production_domain_server + "admin/public/",
  },
  firebase_config: {
    databaseURL: "https://saferoad-srialfb.firebaseio.com",
    databaseURLDues: "https://saferoad-dues.firebaseio.com",
  },
};

const config = process.env.NODE_ENV === "production" ? production : development;

export default config;
