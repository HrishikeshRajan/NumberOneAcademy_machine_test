module.exports.readConfig = (config, key) => {
 if(!key) return null
 try {
   return  config.get(key)
 } catch (error) {
    return null
 }
}