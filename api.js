const express = require ('express')
const app = express()
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3000
var bodyParser = require('body-parser')


app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({ extended: true }));

var cities= ["New York", "Rome", "Casablanca", "Vicenza"]
const  KEY ="SU1UmUjY7SeG07QCIV90uNoSbvJlX8rs"
const  SUN ="https://api.sunrise-sunset.org/json?"
const  mapquest_url = "http://www.mapquestapi.com/geocoding/v1/address?key="+KEY+"&location="


app.get('/', (req,res) => res.send("helloo"))

app.get('/cities', (req,res) => res.send("helloo"))

app.get('/cities/:id', async (req, res) => {
    const index = req.params.id
    console.log(index)
    //res.send("we will provide you with the info of sunrise and sunset for "+index)
    try {
    var lalo=await getcoordinates(index)
    console.log(lalo)
    //chiamo sunsire api
    var sunstr=SUN+"lat="+lalo.lat+"&lng="+lalo.lng
    console.log(sunstr)
    const sunres = await fetch(sunstr,{
          headers: {
              'Accept' : 'application/json',
          }
      } )
    const sun_json = await sunres.json()
    console.log(sun_json)
    res.status(200)
    var sunrise= sun_json.results.sunrise
    var sunset= sun_json.results.sunset
    res.send("sunset in "+index+" is at "+sunset+" and sunrise is at "+sunrise)

    } catch (e) {
      console.log("Errore "+e)
    } finally {
      console.log("Eh niente")
    }
})


app.listen (PORT ,() => console.log('We are running on port '+PORT))

async function getcoordinates(index) {
  try {
      const mapres= await fetch(mapquest_url+index ,{
            headers: {
                'Accept' : 'application/json',
            }
        })
const mapq_json = await mapres.json()
var latlon=mapq_json.results[0].locations[0].latLng
return latlon
  } catch (e) {
    console.log()
    return null
  } finally {
  }

}
