import React, { useRef, useEffect } from 'react';
import './AssetOpenTasksChart.scss'
import CommonChart from '../CommonChart/CommonChart';

const AssetOpenTasksChart = (props) => {

    const colors = props.data && Array.isArray(props.data)
        ? props.data.map((item) => item.color)
        : [];

    const chartData = [
        ['Category', 'Value', 'Color'],
        ...(Array.isArray(props.data) ? props.data : [])
    ];
    const chartRef = useRef(null);
    const totalAddedRef = useRef(false);

    const OpenChartData = chartData
        .filter(obj => obj !== undefined && obj !== null) // Filter out undefined and null
        .map(obj => Object.values(obj))
        .slice(0, 7);
    const categoryMap = {};

    OpenChartData.forEach(([Category, Value]) => {
        if (!categoryMap[Category]) {
            categoryMap[Category] = 0;
        }
        categoryMap[Category] += Value;
    });

    const formatNumberWithCommas = (number) => {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };
    const [highestNumber, maxLength] = [Math.max(...Object.entries(categoryMap).filter(item => typeof item === "number")), Math.max(...Object.entries(categoryMap).map(item => item[1]).slice(1).filter(item => typeof item === "number")).toString().length];

    function formatValuesWithSpaces(value) {
        return value.toString().padStart(maxLength, '0');
    }
    const OpenTasksMergedData = Object.entries(categoryMap).map(([Category, Value]) => [${formatValuesWithSpaces(formatNumberWithCommas(Value))} : ${Category}, Value]);
    const options = {
        title: '',
        // colors: ['#062C8A', '#1A4DD0', '#396FF6', '#5886F7', '#88ABF9', '#C6D6FC'],
        colors,
        fontSize: 10,
        enableInteractivity: true,
        tooltip: { isHtml: true },
        legend: {
            position: 'right',  // Position the legend to the right
            textStyle: {
                fontSize: 9,  // Increase font size
                bold: 400,  // Make text bold  
            },
            alignment: 'start',

            custom: {
                formatter: function (item, options) {
                    // Apply custom styles to the legend items
                    const isSelected = item === props.selectedCategory;
                    return {
                        fillColor: isSelected ? 'transparent' : 'grey', // No fill if selected
                        borderColor: 'black',
                        borderWidth: 2,
                    };
                }
            },
        },
        chartArea: { width: '100%', height: '120' },

    };

    // Calculate the total value
    const openTasksTotal = formatNumberWithCommas(OpenTasksMergedData.slice(1).reduce((acc, [, value]) => acc + value, 0));

    useEffect(() => {
        const chartContainer = chartRef.current;
        if (chartContainer) {
            // Function to add the total value to the legend
            const addTotalToLegend = () => {

                const chartContainer = chartRef.current;
                if (chartContainer) {
                    const svg = chartContainer.querySelector('svg');
                    if (svg) {
                        svg.querySelectorAll('text').forEach((textElement) => {
                            if (textElement.textContent.includes('%')) {
                                textElement.style.display = 'none'; // Hide the element
                            }
                        });
                        const legendItems = Array.from(svg.querySelectorAll('g rect')).filter(
                            text => text.getAttribute('fill') === '#ffffff' // or another suitable condition to find legend items
                        );
                        if (legendItems.length > 0) { // Check if total is not already added
                            const firstLegendItem = legendItems[0];
                            const startsWithNumber = /^\d{1,3}(,\d{3})*(\d*)\sTotal\sTasks/;

                            // Check if total is already added
                            const totalExists = Array.from(svg.querySelectorAll('text')).some(
                                text => startsWithNumber.test(text.textContent)
                            );
                            if (!totalExists) {
                                const totalGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                                const totalText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                                totalText.setAttribute('text-anchor', 'start')
                                totalText.setAttribute('x', ${parseFloat(firstLegendItem.getAttribute('x'))});
                                totalText.setAttribute('y', ${parseFloat(firstLegendItem.getAttribute('y')) - 19});
                                totalText.setAttribute('font-size', '12');
                                totalText.setAttribute('font-weight', '500');
                                totalText.setAttribute('color', '#000');
                                totalText.textContent = ${openTasksTotal} Total Tasks;

                                const translateX = -10;  // Adjust these values as needed
                                const translateY = 5;
                                totalText.setAttribute('transform', translate(${translateX}, ${translateY}));

                                firstLegendItem.parentNode.insertBefore(totalText, firstLegendItem);

                                totalAddedRef.current = true; // Mark total as added
                                // // Temporarily disconnect the observer to prevent infinite loop
                                observer.disconnect();
                                // // Reconnect the observer
                                observer.observe(chartRef.current, { childList: true, subtree: true });

                            }
                        }
                    }
                }
            };

            // Create a MutationObserver to watch for changes in the chart container
            const observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        addTotalToLegend();
                        break;
                    }
                }
            });

            observer.observe(chartContainer, { childList: true, subtree: true });

            // Cleanup observer on component unmount
            return () => {
                observer.disconnect();
            };
        }

    }, [openTasksTotal]);

    return (
        <div className="assetOpenTasks">
            <div ref={chartRef} >
                {props.tasks.length > 0 ? <CommonChart
                    chartType="PieChart"
                    data={OpenTasksMergedData}
                    options={options}
                    chartEvents={props.chartEvents}
                    width={'265px'}
                /> : <p className="taskMessage">Select tasks to see a breakdown of orders</p>}
            </div>
        </div>
    );
};

export default AssetOpenTasksChart;