# Google Maps Static API Demo

This is a demo in NodeJS + Express to show how to properly build Static Maps URLs with encoded polylines.
With a given origin and destination, the `/api/generate` endpoint will call the Maps Directions Web Service  and return an array of static map urls, each displaying the encoded polyline from the Directions request. 

## How to run

1. Install all packages with ` npm install `
2. In `index.js` replace `YOUR_API_KEY` with your own [API key](https://developers.google.com/maps/documentation/maps-static/get-api-key) from the Google Maps Platform. Make sure you have Directions API and Maps Static API enabled in your Google Cloud project. 
3. Run ` npm start `, by default the app listens on port 3000.
4. If using curl, you can try this sample command to make a post request to `/api/generate`:

```
curl -X POST -d '{
  "origin" : "Gare Centrale routière, Luxembourg",
  "destination" : "Kirchberg, Luxembourg"
}' -H "content-type: application/json" "http://localhost:3000/api/generate"
```

This uses `node-fetch` to make an HTTP request to the Maps Directions Web Service using your `origin` and `destination`. On a successful request, a Maps Static API url will be generated using each of the returned route overview_polylines. 

### Sample Response
If you use `buildStaticMapsURL()` you should get an array of properly encoded URLs. 
```
[
  "https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY&size=400x400&center=49.59917%2C6.13301&zoom=12
  &path=color%3A0x0000ff%7Cweight%3A6%7Cenc%3A_ivmHmxld%40pCjATJAb%40Hx%40B%7C%40BxBO%7ECk%40nJOdCGlAu%40fMe%40nKE%60%40ITOTKJwAh%40Yd%40KVGd%40AnAJzEAdCOXQTKBQBOO_%40UuCgAcAi%40qBw%40kAg%40%7D%40WK%40SIg%40Q_%40Ek%40%3Fm%40N_E%60BkBv%40u%40ZOEuAIcBMCIISeAiCyAoDeNfFqAl%40oBh%40sAFoAEaCs%40eAm%40uEkCmCyA%7D%40%5D%7B%40OSIMG%5Do%40wBeHOKaBeFm%40qBO%7B%40s%40%7DIQ%7BBWuA%5BqDg%40uGSqC%5BwCw%40aLoAgPIa%40CQ%5BoDGSGESIKK%5BGyA%5BeG_C%7B%40a%40s%40a%40w%40q%40a%40c%40a%40o%40kDoGw%40%7DA%7B%40wBsCqIs%40uBQu%40WgAgAcDoBmGwCiJoCkIeD_K"
]
```

You can also test and use `buildStaticMapsURLviaStringInterpolation()` to see what happens if you build the URL solely on string interpolation. Here's a sample response:
```
[
  "\n    
https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY&size=400x400&center=49.59917,6.13301&zoom=12&path=color:0x0000ff|weight:6|enc:_ivmHmxld@pCjAvB`AlAd@pB`An@VRFDD^C\\OX]`@_Ap@uBVu@VgALu@[Hi@Am@Cm@EoAUaA[iAi@e@W[Ia@_@_AsAo@kA{AgCe@c@wHgDq@]s@Yk@GS?aBBo@FaBt@iAp@[F[?QEoBaAoAq@a@QIBONm@|Aq@pBQ`@BN^dDVjC?^@b@ARERGJEA_@I]G_AE}DAo@@c@DoBb@u@^m@^aAh@qAn@eA`@q@NS@aAEw@Uy@c@m@c@yA_A_@Qg@IYEu@C{@Lw@Xa@R_Al@y@l@c@b@_@\\i@l@}@xAc@v@cB`CM~@Bj@lAjFlAzEDZyCjAcChAgIfDSgAQ{BQcCe@uFM_Bo@kIKyAWaCUsCe@cHoAgPIa@CQUuCMm@GEMEQOgASm@OeG_C{@a@s@a@w@q@a@c@a@o@kDoGw@}AuAqDyBwGs@uBQu@WgAgAcDoBmGcFwOiF}O\n  "
]
```



