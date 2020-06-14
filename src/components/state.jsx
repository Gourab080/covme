import React, {useEffect, useRef, useState} from 'react';
import DisplayCard from './display-card';
import axios from 'axios';
import Table from './table';
import Map from './Map';
import {Link, useHistory, useParams} from 'react-router-dom';
import {STATE_CODES} from '../constants/state-code';
import {POPULATION, PUPULATION_SOURCE} from '../constants/population.js';
import {getFormattedTestingData} from '../utils/format-test';
import TrendGraph from './trend-chart';
import {animationDelay, clone, IS_MOBILE_DEVICE, shareTheApp, timeDifference} from '../utils/common-utils';
import Chart from './Chart';
import {Helmet} from 'react-helmet';
import {Button} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import MetaCard from './meta-card';
import {dailyTrend} from '../charts/daily';
import Footer from './footer';

const d3 = window.d3;

function State({}) {
    const [fetched, setFetched] = useState(false);
    const [tableData, setTableData] = useState({rows: [], columns: []});
    const [mapInitData, setMapInitData] = useState({});
    const [testingData, setTestingData] = useState({});
    const [spinner, setSpinner] = useState(true);
    const childRef = useRef();

    const {stateCode} = useParams();
    const history = useHistory();

    const stateName = STATE_CODES[stateCode];
    const statesKeys = Object.keys(STATE_CODES);

    // if (childRef.current) {
    //     setInterval(function () {
    //         childRef.current.updateDisplayCardCounts(Math.random());
    //     }, 1000);
    // }

    const getCards = (total = {}, today = {}) => {
        return [
            {
                name: 'Confirmed',
                value: total.confirmed,
                delta: today.confirmed,
                colorClass: 'red',
            },
            {
                name: 'Active',
                value: total.active,
                delta: today.active,
                colorClass: 'orange',
            },
            {
                name: 'Recovered',
                value: total.recovered,
                delta: today.recovered,
                colorClass: 'green',
            },
            {
                name: 'Dead',
                value: total.dead,
                delta: today.dead,
                colorClass: 'gray',
            },
        ];
    };

    const [displayCards, setDisplayCards] = useState(getCards());
    const [districtData, setDistrictData] = useState([]);
    const [dailyChart, setDailyChart] = useState(null);
    const [wordcloudChart, setWordcloudChart] = useState(null);
    const [caseHistory, setCaseHistory] = useState(null);
    const [chartStore, updateChartStore] = useState({});
    const [percentChart, setPercentChart] = useState({});
    const [updatedTime, setUpdatedTime] = useState();
    const [zones, setZones] = useState();

    useEffect(() => {
        setFetched(false);
        getData();
    }, [stateCode]);

    const getData = async () => {
        try {
            let [
                {data: district_data},
                {data: state_data},
                {
                    data: {state: history},
                },
                {data: zonesV2},
                {data: dailyChart},
                {data: percentChartJson},
                {data: tests},
                {data: stateBar},
            ] = await Promise.all([
                axios.get('https://api.track-covid19.in/district_v2.json'),
                axios.get('https://api.track-covid19.in/reports_v2.json'),
                axios.get('https://api.track-covid19.in/history.json'),
                axios.get('https://api.track-covid19.in/zones.json'),
                axios.get('/charts/daily.json'),
                axios.get('/charts/percent-chart.json'),
                axios.get('https://api.track-covid19.in/tests.json'),
                axios.get('/charts/states.json'),
            ]);

            // hide spinner
            setSpinner(false);

            let districtInfo = district_data[stateCode];
            let stateInfo = state_data.states[stateCode];
            let stateTestHistory = tests.states[stateCode],
                testing_data = stateInfo.testing_data;

            if (stateTestHistory) {
                testing_data = stateTestHistory[stateTestHistory.length - 1];
            }

            let state_population = POPULATION[stateCode];

            var formatTime = d3.timeFormat('%B %d, %I:%M%p IST');
            let parseTime = d3.timeParse('%d/%m/%Y %H:%M:%S');
            let updatedTime = parseTime(stateInfo.updatedTime);
            setUpdatedTime(`${timeDifference(new Date(), updatedTime)} - ${formatTime(new Date(updatedTime))}`);

            let testingData = getFormattedTestingData(testing_data, state_population, districtInfo.state);
            setTestingData(testingData);

            // fix the negative deaths and
            districtInfo.districts.forEach((district) => {
                let {today} = district;
                if (today) {
                    today.confirmed = Math.max(0, today.confirmed);
                    today.recovered = Math.max(0, today.recovered);
                    today.dead = Math.max(0, today.dead);
                    today.active = today.confirmed - today.recovered - today.dead;
                }
            });

            // find out the unknowns
            {
                let districts = districtInfo.districts.filter((d) => d.district !== 'Unknown');
                let totalKnownConfirmed = d3.sum(districts, (district) => district.confirmed),
                    totalKnownRecovered = d3.sum(districts, (district) => district.recovered),
                    totalKnownDeaths = d3.sum(districts, (district) => district.dead);

                let unknowns = {
                    district: 'Unknown',
                    confirmed: stateInfo.confirmed - totalKnownConfirmed,
                    recovered: stateInfo.recovered - totalKnownRecovered,
                    dead: stateInfo.dead - totalKnownDeaths,
                };
                unknowns.active = unknowns.confirmed - unknowns.recovered - unknowns.dead;
                if (unknowns.confirmed || unknowns.recovered || unknowns.dead) {
                    districts.push(unknowns);
                }
                districtInfo.districts = districts;
            }

            {
                let {today} = stateInfo;
                if (today) {
                    today.confirmed = Math.max(0, today.confirmed);
                    today.recovered = Math.max(0, today.recovered);
                    today.dead = Math.max(0, today.dead);
                    today.active = today.confirmed - today.recovered - today.dead;
                }
            }

            setDisplayCards(getCards(stateInfo, stateInfo.today));
            setDistrictData(districtInfo.districts);

            let mapInitData = {
                confirmed: stateInfo.confirmed,
                active: stateInfo.active,
                recovered: stateInfo.recovered,
                dead: stateInfo.dead,
                name: stateInfo.name,
                today: stateInfo.today,
            };
            setMapInitData(mapInitData);

            setTableData({
                rows: districtInfo.districts,
                columns: [
                    {name: 'district', accessor: 'district'},
                    {
                        name: IS_MOBILE_DEVICE ? 'cnfmd' : 'confirmed',
                        accessor: 'confirmed',
                        colorClass: 'red',
                    },
                    {
                        name: IS_MOBILE_DEVICE ? 'actv' : 'active',
                        accessor: 'active',
                        colorClass: 'orange',
                    },
                    {
                        name: IS_MOBILE_DEVICE ? 'Rcvrd' : 'recovered',
                        accessor: 'recovered',
                        colorClass: 'green',
                    },
                    {
                        name: 'dead',
                        accessor: 'dead',
                        colorClass: 'gray',
                    },
                ],
            });

            setDailyChart(dailyChart);
            if (history[stateCode]) {
                setCaseHistory(history[stateCode]);
            }

            {
                percentChartJson.seriesdata.chartdata[0] = {
                    type: 'pie',
                    data:
                        stateInfo.confirmed > 0
                            ? [
                                  ['Active', stateInfo.active],
                                  ['Recovered', stateInfo.recovered],
                                  ['Dead', stateInfo.dead],
                              ]
                            : [],
                };
                setPercentChart(percentChartJson);
            }

            {
                let districts = districtInfo.districts.filter((district) => district.confirmed > 0);

                if (districts.length > 4) {
                    let dd = districts.filter((d) => d.district !== 'Unknown');
                    let wordcloudSeries = dailyTrend(Object.values(dd), 'district', ['confirmed']),
                        wordCloudChart = clone(stateBar);

                    wordCloudChart.canvas.title.text = 'Word Cloud of Affected Districts';
                    wordCloudChart.chart.axes.yaxis[0].label.text = 'Total';
                    wordCloudChart.seriesdata.chartdata[0] = {
                        type: 'wordcloud',
                        data: wordcloudSeries,
                        seriesname: 'Confirmed',
                    };
                    wordCloudChart.legend.colors = ['#E91E63'];
                    wordCloudChart.legend.enabled = false;
                    wordCloudChart.chart.plot.plotoptions.wordcloud = {
                        minSize: '2.5%',
                        maxSize: '15%',
                        legendHighlightEffect: {
                            selectedSeries: 'invert',
                        },
                    };
                    setWordcloudChart(wordCloudChart);
                }
            }

            let zoneV2 = zonesV2[stateCode].map((row) => [row.district, `${row.zone} Zone`]);
            setZones(zoneV2);

            setFetched(true);
        } catch (err) {
            console.log(err);
        }
    };

    const changeStatePage = (event) => {
        history.push('/state/' + event.target.value);
    };

    function chartCallback(chart, name) {
        chartStore[name] = chart;
        updateChartStore(chartStore);
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Coronavirus Outbreak in {STATE_CODES[stateCode]} - track-covid19.in</title>
                <meta
                    name="title"
                    content={`Coronavirus Outbreak in ${STATE_CODES[stateCode]}: Latest Map and Case Count`}
                />
                <meta
                    name="description"
                    content={`Live statistics of Coronavirus (COVID-19) in ${STATE_CODES[stateCode]} - India. Track the confirmed cases, recovered patients, and death toll of India due to the COVID-19 coronavirus.`}
                />
            </Helmet>
            <div className="container">
                {spinner && (
                    <div
                        className="flex items-center justify-center fixed h-screen w-full z-10"
                        style={{left: 0, top: 0}}
                    >
                        <div className="lds-dual-ring"></div>
                    </div>
                )}
                {fetched && (
                     <h1> Not Found </h1>
                    <Footer />
                )}
            </div>
        </React.Fragment>
    );
}

export default State;
