function showChart() {
    const ar1 = document.getElementsByClassName('arr1__vals')[0].value.split(',');
    const ar2 = document.getElementsByClassName('arr2__vals')[0].value.split(',');

    function rC() {
        const num = Math.round(0xffffff * Math.random());
        const r = num >> 16;
        const g = num >> 8 & 255;
        const b = num & 255;
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    const dots = ar1.map((x, i) => {
        return {
            label: ["dot"],
            backgroundColor: rC(),
            borderColor: ['black'],
            title: `x-${x} y-${ar2[i]}`,
            data: [{
                x: x,
                y: ar2[i],
                r: 10
            }]
        }
    });

    if (typeof oneChart === "undefined") {
        oneChart = new Chart(document.getElementById("myChart1"), {
            type: 'bubble',
            data: {
                datasets: dots
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    // text: 'Predicted world population (millions) in 2050'
                },

            }
        });

        Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing) {
                const ctx = chart.ctx;
                chart.data.datasets.forEach(function (dataset, i) {
                    const meta = chart.getDatasetMeta(i);
                    if (meta.type == "bubble") { //exclude scatter
                        meta.data.forEach(function (element, index) {
                            ctx.fillStyle = 'rgb(0, 0, 0)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Helvetica Neue';
                            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                            const dataString = dataset.data[index].toString();
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataset.title, position.x, position.y - (fontSize / 2) - padding);
                        });
                    }
                });
            }
        });
    } else {
        oneChart.config.data = { datasets: dots };
        oneChart.update();
    }

}