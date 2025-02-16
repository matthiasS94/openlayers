import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import ImageLayer from "ol/layer/Image.js";
import ImageWMS from "ol/source/ImageWMS.js";
import WMSCapabilities from "ol/format/WMSCapabilities.js";

const map = new Map({
  target: "map-container",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});

var baseUrl = "";
const getCapabilitiesParams = "?service=WMS&request=GetCapabilities";

document.getElementById("urlForm").addEventListener("submit", function (event) {
  event.preventDefault();
  baseUrl = document.getElementById("urlInput").value;

  fetch(baseUrl + getCapabilitiesParams)
    .then(function (response) {
      return response.text();
    })
    .then(function (getCapabilitiesResponse) {
      const parser = new WMSCapabilities();
      const capabilities = parser.read(getCapabilitiesResponse);
      const stringCapabilities = JSON.stringify(capabilities);
      const jsonCapabilities = JSON.parse(stringCapabilities);
      const availableLayers = jsonCapabilities.Capability.Layer.Layer;
      const layerList = [];
      for (const layer of availableLayers) {
        const wmsLayer = new ImageLayer({
          source: new ImageWMS({
            url: baseUrl,
            params: { LAYERS: layer.Name },
            ratio: 1,
            serverType: "geoserver",
          }),
        });
        map.addLayer(wmsLayer);
        layerList.push("Layer Name: " + layer.Name);
      }

      document.getElementById("log").innerText = layerList;
    });
});
