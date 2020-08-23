function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      //initailize the DOM on first time with first item in array
      buildMetadata(sampleNames[0]);
      buildCharts(sampleNames[0]);
  })};
  
  // repopulate page if item is clicked/changed on the dropdown
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  };

// json file looks like this:
// {
// "names":[
//  "940", .....],
// "metadata": [{
//  "id":940, 
//  "ethnicity: "Caucasian",
//  "gender": "F",
//  "age": 24.0,
//  "location": "Beauford/NC"
//  "bbtype": "I",
//  "wfreq": 2.0}.......],
// "samples":[{
//   "id":"940",
//   "otu_ids": [1167,2859,.....],
//   "sample_values": [163,126,...],
//   "otu_labels": ["Bacteria;Bacteriodetes;....."]....
//}]
  // build the small pane with the demographics
  function buildMetadata(sample) { //sample is the id number from the dropdown
    // the entire json file becomes 'data'
    d3.json("samples.json").then((data) => {
      
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      //result looks like this:
      // {id: 940, ethnicity: "Caucasian", gender: "F", age: 24, location: "Beaufort/NC", …}
      console.log(result)
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
      PANEL.append("h6").text("Gender: " + result.gender);
      PANEL.append("h6").text("Age: " + result.age);
      PANEL.append("h6").text("Location: " + result.location);
      PANEL.append("h6").text("bbtype: " + result.bbtype);
      PANEL.append("h6").text("wfreq: " + result.wfreq);
      
    });
  };
// "samples":[{
//   "id":"940",
//   "otu_ids": [1167,2859,.....],
//   "sample_values": [163,126,...],
//   "otu_labels": ["Bacteria;Bacteriodetes;....."]....
  function buildCharts(sample) {
   
    d3.json("samples.json").then((data) => {
      // get "sample_values" from samples
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      console.log(resultArray);
      //Get top 10 elements for each array
      var valuesArray = resultArray[0].sample_values.slice(0,10).reverse();
      var otu_idsArray = resultArray[0].otu_ids.slice(0,10).reverse();
      var otu_labelsArray = resultArray[0].otu_labels.slice(0,10).reverse();
      console.log(valuesArray);
      console.log(otu_idsArray);
      console.log(otu_labelsArray);
    
      // Concatenate "OTU "to the out_id 
      // This makes the value a string and the y-axis
      // will have ten values instead of a large
      // range of integers
      var OTUs = otu_idsArray.map((num) => "OTU " + num);
      console.log(OTUs);

      //Horizontal Bar Chart
      var trace = {
        x: valuesArray,
        y: OTUs,
        type: 'bar',
        orientation: 'h',      //horizontal
        text: otu_labelsArray,  //hover label
};
      var layoutBar = {
        xaxis: {
        title: "Sample's Bacterial Count",
       },
        yaxis: {
        title: 'Operational Taxonomic Unit #'
       },
        title: "Top Ten Bacterial Species <br> in Participant's Navel"
      };

      data = [trace];  
      Plotly.newPlot('bar', data, layoutBar); // html div id="bar"
  });
}
init();
  
  