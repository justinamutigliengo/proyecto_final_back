import * as url from "url";

const config = {
  PORT: 8080,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
  MONGODB_URI:
    "mongodb+srv://coder_53160:coder2024@clustercoder.zi5pkou.mongodb.net/ecommerce",
};

export default config;
