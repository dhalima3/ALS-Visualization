function main() {

	var graph = Viva.Graph.graph();

	var graphics = Viva.Graph.View.svgGraphics(),
	    nodeSize = 40;

	// In this example we fire off renderer before anything is added to
	// the graph:
	var renderer = Viva.Graph.View.renderer(graph, {
	        graphics : graphics
	    });
	renderer.run();

	graphics.node(function(node) {
	    return Viva.Graph.svg('image')
	         .attr('width', nodeSize)
	         .attr('height', nodeSize)
	         .link(node.data.url); 
	}).placeNode(function(nodeUI, pos) {
	    nodeUI.attr('x', pos.x - nodeSize / 2).attr('y', pos.y - nodeSize / 2);
	});


	// To render an arrow we have to address two problems:
	//  1. Links should start/stop at node's bounding box, not at the node center.
	//  2. Render an arrow shape at the end of the link.

	// Rendering arrow shape is achieved by using SVG markers, part of the SVG
	// standard: http://www.w3.org/TR/SVG/painting.html#Markers
	var createMarker = function(id) {
	        return Viva.Graph.svg('marker')
	                   .attr('id', id)
	                   .attr('viewBox', "0 0 10 10")
	                   .attr('refX', "10")
	                   .attr('refY', "5")
	                   .attr('markerUnits', "strokeWidth")
	                   .attr('markerWidth', "10")
	                   .attr('markerHeight', "5")
	                   .attr('orient', "auto");
	    },

	    marker = createMarker('Triangle');
	marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

	// Marker should be defined only once in <defs> child element of root <svg> element:
	var defs = graphics.getSvgRoot().append('defs');
	defs.append(marker);

	var geom = Viva.Graph.geom();

	graphics.link(function(link){
	    // Notice the Triangle marker-end attribe:
	    return Viva.Graph.svg('path')
	               .attr('stroke', 'gray')
	               .attr('marker-end', 'url(#Triangle)');
	}).placeLink(function(linkUI, fromPos, toPos) {
	    // Here we should take care about
	    //  "Links should start/stop at node's bounding box, not at the node center."

	    // For rectangular nodes Viva.Graph.geom() provides efficient way to find
	    // an intersection point between segment and rectangle
	    var toNodeSize = nodeSize,
	        fromNodeSize = nodeSize;

	    var from = geom.intersectRect(
	            // rectangle:
	                    fromPos.x - fromNodeSize / 2, // left
	                    fromPos.y - fromNodeSize / 2, // top
	                    fromPos.x + fromNodeSize / 2, // right
	                    fromPos.y + fromNodeSize / 2, // bottom
	            // segment:
	                    fromPos.x, fromPos.y, toPos.x, toPos.y)
	               || fromPos; // if no intersection found - return center of the node

	    var to = geom.intersectRect(
	            // rectangle:
	                    toPos.x - toNodeSize / 2, // left
	                    toPos.y - toNodeSize / 2, // top
	                    toPos.x + toNodeSize / 2, // right
	                    toPos.y + toNodeSize / 2, // bottom
	            // segment:
	                    toPos.x, toPos.y, fromPos.x, fromPos.y)
	                || toPos; // if no intersection found - return center of the node

	    var data = 'M' + from.x + ',' + from.y +
	               'L' + to.x + ',' + to.y;

	    linkUI.attr("d", data);
	});

graph.addNode('BillGates', {url : 'img/BillGates.jpeg'});
graph.addNode('ChrisAnderson', {url : 'img/ChrisAnderson.png'});
graph.addNode('ElonMusk', {url : 'img/ElonMusk.png'});
graph.addNode('Macklemore', {url : 'img/Macklemore.jpeg'});
graph.addNode('MarkZuckerberg', {url : 'img/MarkZuckerberg.jpg'});
graph.addNode('ReedHastings', {url : 'img/ReedHastings.jpg'});
graph.addNode('RyanSeacrest', {url : 'img/RyanSeacrest.jpg'});
graph.addNode('SherylSandberg', {url : 'img/SherylSandberg.jpg'});

graph.addLink('MarkZuckerberg', 'BillGates');
graph.addLink('MarkZuckerberg', 'ReedHastings');
graph.addLink('MarkZuckerberg', 'SherylSandberg');
graph.addLink('BillGates', 'ElonMusk');
graph.addLink('BillGates', 'ChrisAnderson');
graph.addLink('BillGates', 'RyanSeacrest');
graph.addLink('ReedHastings', 'Macklemore');

// Set custom nodes appearance
var graphics = Viva.Graph.View.svgGraphics();
graphics.node(function(node) {
       // The function is called every time renderer needs a ui to display node
       return Viva.Graph.svg('image')
             .attr('width', 24)
             .attr('height', 24)
             .link(node.data.url); // node.data holds custom object passed to graph.addNode();
    })
    .placeNode(function(nodeUI, pos){
        // Shift image to let links go to the center:
        nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12);
    });

var renderer = Viva.Graph.View.renderer(graph, 
    {
        graphics : graphics
    });
renderer.run();

// }
}