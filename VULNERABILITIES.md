# Known vulnerabilities

- `hapijs/hoek@2.16.3`

  Moderate severity 

  [CVE-2018-3728](https://nvd.nist.gov/vuln/detail/CVE-2018-3728)

  This is installed by `node-sass` which will not update from `request@2.79.0` (its dependency that requires `hoek`)

  See https://github.com/sass/node-sass/pull/2291

  Since node-sass is absolutely necessary, the vulnerability cannot be fixed.

  NB. the vulnerable code is run during the `npm install` process only to download binaries for sass.

