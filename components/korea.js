import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as input from './json/korea.json';

//지도 그리기
export default function korea() {
  useEffect(() => {
    const svg = d3.select("#area");


    var width = 700; //지도의 넓이
    var height = 700; //지도의 높이
    var initialScale = 5500; //확대시킬 값
    var initialX = -11900; //초기 위치값 X
    var initialY = 4050; //초기 위치값 Y
    var labels;

    var projection = d3.geo.mercator()
        .scale(initialScale)
        .translate([initialX, initialY]);

    var path = d3.geo.path().projection(projection);

    var zoom = d3.behavior
	.zoom()
	.translate(projection.translate())
	.scale(projection.scale())
        .scaleExtent([height, 800 * height])
        .on('zoom', zoom);

    var states = svg
        .append('g')
        .attr('id', 'states')
        .call(zoom);

    states
        .append('rect')
        .attr('class', 'background')
        .attr('width', width + 'px')
        .attr('height', height + 'px')
	.attr('fill', '#0067A3');

    //Color Bar
    states.append("image")
 	.attr("xlink:href","/map1.png")
  	.attr("x",20)
  	.attr("y",20)
  	.attr("width",170)
  	.attr("hieight",10)
	
	states
            .selectAll('path') //지역 설정
            .data(input.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('id', function(d) {
                return 'path-' + d.properties.name_eng;
            })
	    .style('fill', colorMap);

        labels = states
            .selectAll('text')
            .data(input.features) //라벨표시
            .enter()
            .append('text')
            .attr('transform', translateTolabel)
            .attr('id', function(d) {
                return 'label-' + d.properties.name_eng;
            })
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(function(d) {
                return d.properties.name;
            })

    //텍스트 위치 조절 - 하드코딩으로 위치 조절을 했습니다.
    function translateTolabel(d) {
        var arr = path.centroid(d);
        if (d.properties.name == '인천광역시') {
            //서울 경기도 이름 겹쳐서 경기도 내리기
            arr[1] +=
                d3.event && d3.event.scale
                    ? d3.event.scale / height-40
                    : initialScale / height-40;
        } else if (d.properties.name == '경기도') {
            //충남은 조금 더 내리기
            arr[1] +=
                d3.event && d3.event.scale
                    ? d3.event.scale / height + 30
                    : initialScale / height + 30;
        }
        return 'translate(' + arr + ')';
    }
    
    //배출량에 따라서 지자체의 색을 결정
    function colorMap(d){
	var levelOne = ['전라남도', '경상남도', '강원도'];
        var levelTwo = ['충청북도', '전라북도', '경상북도'];
	var levelThree = ['경기도', '대전광역시', '울산광역시']
	var levelFour = ['서울특별시', '인천광역시', 
	'대구광역시', '부산광역시', '세종특별자치시'];
        if(levelOne.includes(d.properties.name))
	   return '#008000';
	else if(levelTwo.includes(d.properties.name))
	   return '#FFB900';
	else if(levelThree.includes(d.properties.name))
	   return '#FF7F00';
	else
	   return '#FF0000'; 
    }

    function zoom() {
        projection.translate(d3.event.translate).scale(d3.event.scale);
        states.selectAll('path').attr('d', path);
        labels.attr('transform', translateTolabel);
    }

  }, []);
  return (
    <div className="korea">
      <svg id="area" height={700} width={700}></svg>
    </div>
  );
}

