import express from 'express'
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors'

const app = express();

app.use(bodyParser.json());

// This enables CORS from all sources so do not use this setting in prod
app.use(cors());

// Use your own API KEY when you get started with Google Maps Platform API
// Warning: this does not yet use digital signatures so it's really only for local demo purposes.
// It's HIGHLY recommended to use digital signatures and quotas to prevent unexpected bills
const API_KEY = 'YOUR_API_KEY'
const MAPS_DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json'
const STATIC_MAPS_URL = 'https://maps.googleapis.com/maps/api/staticmap'

app.post('/api/generate', async (req,res) => {
  const body = req.body;
  const staticMapRequests = [];
  if(!body) res.send('no request body found')

  const url = new URL(MAPS_DIRECTIONS_URL)
  url.searchParams.append('key', API_KEY)
  url.searchParams.append('mode', 'driving')
  url.searchParams.append('alternatives', 'true')

  if(body.origin && body.destination) {
    url.searchParams.append('origin', body.origin)
    url.searchParams.append('destination', body.destination)
  }

  try {
    const directionsResponse = await fetch(url);
    const directionsData = await directionsResponse.json();
    if(directionsData && directionsData.status === 'OK') {
      directionsData.routes.forEach(route => {
        const overviewPolyline = route.overview_polyline.points;
        staticMapRequests.push(buildStaticMapsURL({polyline: overviewPolyline}))
      })
      res.send(staticMapRequests)
    } else {
      res.send('No directions data retrieved')
    }
  } catch(err) {
    res.send('Error calling Directions Web Service: ' + err)
  }
})


// build a static maps url using string interpolation (NOT IDEAL)
// for testing, you can see how encoded polylines are not properly escaped or URL encoded
function buildStaticMapsURLviaStringInterpolation(path, size = '400x400', center = '49.59917,6.13301', zoom = '12' ) {
  const pathColor = path.color ? `${path.color}` : '0x0000ff'
  const pathWeight = path.weight ? `${path.weight}` : '6'
  const pathEncPolyline = path.polyline ? `${path.polyline}` : 'exj~Fp}~uOox@hC'
  const pathParam = `${pathColor}|${pathWeight}|${pathEncPolyline}`
  return `
    ${STATIC_MAPS_URL}?key=${API_KEY}&size=${size}&center=${center}&zoom=${zoom}&path=color:${pathColor}|weight:${pathWeight}|enc:${pathEncPolyline}
  `
}

// build a static maps url using proper URL encoding with searchParams.append
function buildStaticMapsURL(path, size = '400x400', center = '49.59917,6.13301', zoom = '12') {
  const url = new URL(STATIC_MAPS_URL)
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('size',size);
  url.searchParams.append('center',center);
  url.searchParams.append('zoom',zoom);

  if(!path.polyline) return url;
  const pathColor = path.color ? `color:${path.color}` : 'color:0x0000ff'
  const pathWeight = path.weight ? `weight:${path.weight}` : 'weight:6'
  const pathEncPolyline = path.polyline ? `enc:${path.polyline}` : 'enc:exj~Fp}~uOox@hC'
  const pathParam = `${pathColor}|${pathWeight}|${pathEncPolyline}`

  url.searchParams.append('path',pathParam);

  return url;
}

// Get a defaulted sample for a static map with a polyline
app.get('/api/default', (req,res) => {
  const url = buildStaticMapsURL({polyline: '_bwmHozed@a\\cDivIb|BldE@@'})
  res.send(url)
})

app.listen(3000, () => console.log('Generator server started on port 3000'));