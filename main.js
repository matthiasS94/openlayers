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

  fetch("/api" + getCapabilitiesParams, {
    headers: {
      "x-api-target": baseUrl,
    },
  })
    .then((response) => response.text())
    .then((getCapabilitiesResponse) => {
      const parser = new WMSCapabilities();
      const capabilities = parser.read(getCapabilitiesResponse);
      const availableLayers = capabilities.Capability.Layer.Layer;

      const layerContainer = document.getElementById("layerContainer");

      availableLayers.forEach((layer) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = layer.Name;
        checkbox.dataset.layerName = layer.Name;

        const label = document.createElement("label");
        label.htmlFor = layer.Name;
        label.textContent = layer.Name;

        const layerWrapper = document.createElement("div");
        layerWrapper.appendChild(checkbox);
        layerWrapper.appendChild(label);

        layerContainer.appendChild(layerWrapper);

        // create WMS Layer, but do not add to Map
        const wmsLayer = new ImageLayer({
          source: new ImageWMS({
            url: baseUrl,
            params: { LAYERS: layer.Name },
            ratio: 1,
            serverType: "geoserver",
          }),
        });

        checkbox.addEventListener("change", function () {
          if (this.checked) {
            map.addLayer(wmsLayer);
          } else {
            map.removeLayer(wmsLayer);
          }
        });
      });
    });
});
