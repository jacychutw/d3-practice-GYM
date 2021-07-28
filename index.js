var svg = d3.select("svg");
const g = svg.append("g");

svg.call(d3.zoom().on("zoom",() => {
  g.attr("transform", d3.event.transform);
}));

var projectmethod = d3.geoMercator().center([123, 24]).scale(5500);
var pathGenerator = d3.geoPath().projection(projectmethod);

d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .attr('style', 'position: absolute; opacity: 0;');

var projection = d3.geoMercator().center([123, 24]).scale(5500);

async function draw() {
  const [jsondata, csvdata] = await Promise.all([
    d3.json("./COUNTY_MOI_1090820.json"),
    d3.csv("./全國運動場館資訊.csv"),
  ])

  // 地圖的檔案先讀取
  console.log("json")
  const geometries = topojson.feature(jsondata, jsondata.objects["COUNTY_MOI_1090820"])
  g.append("path")
  const paths = g.selectAll("path").data(geometries.features);
  paths.enter()
    .append("path")
      .attr("d", pathGenerator)
      .attr("class","county")

  // 場館的檔案後讀取
  console.log("csv")
  g.selectAll("circle")
    .data(csvdata)
    .enter()
    .append("circle")
      .attr("cx", function(d) {
        return projection([d["經度"], d["緯度"]])[0];
      })
      .attr("cy", function(d) {
        return projection([d["經度"], d["緯度"]])[1];
      })
      .attr("r", 0.2)
      .style("fill", "gray")
    .on("mouseover", function(d) {
      console.log(projection([d["經度"], d["緯度"]]))
      d3.select('#tooltip').style('opacity', 1).html('<div class="custom_tooltip">縣市：' + d["縣市"] + '<br>場名：' + d["場館名稱"] + '<br>租借資訊：' + d["租借資訊"] +'</div>')
    })
    .on("mousemove", function(d) {
      d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
    })
    .on("mouseout", function(d) {
      d3.select('#tooltip').style('opacity', 0)
    })
}

draw();