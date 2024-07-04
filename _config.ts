import lume from "lume/mod.ts"
import sass from "lume/plugins/sass.ts"

const site = lume({
  src: "./_src",
  dest: "./_site",
  prettyUrls: false,
})


site.copy("assets", ".")
site.copy("api", ".")
site.use(sass())

export default site