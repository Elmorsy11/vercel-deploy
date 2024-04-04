import React from 'react'
import dynamic from 'next/dynamic';
import { Card, Col } from 'react-bootstrap';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import Pageloading from "../../Pageloading";
import { useTranslation } from 'next-i18next';
export default function Ridesstatistics({ loading, data }) {

	const { t } = useTranslation("dashboard")
	let totalRides = data?.map((el) => el?.totalBookings	) || [];
	let activeRides = data?.map((el) => el?.upcomingRunningBookings	) || [];
	let dayDate = data?.map((el) => `${el?._id	}`) || [];
	const chart = {
		series: [
			{
				name: "Total Rides",
				data: totalRides,
			},
			{
				name: "Active Rides",
				data: activeRides,

			},
		],
		options: {
			chart: {
				height: 300,
				type: "area",
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: "smooth",
				width: 1,
			},
			colors: ["#3DAAB0", "#F16C20", "#1AA052", "#70ea6b"],
			xaxis: {
				type: "datetime",
				categories: dayDate,
			},
			tooltip: {
				x: {
					format: "dd/MM/yy HH:mm",
				},
			},
		},
	};

	return (
		<>
			<Col md="6">
				<Card style={{ height: "calc(100% - 2rem)" }}>
					<Card.Body>
						<h4 className="text-secondary mb-3 fw-normal">
							{t("Rides statistics")}
						</h4>
						{loading ? (
							<Pageloading />
						) : (<Chart
							options={chart.options}
							series={chart.series}
							type="area"
							height={300}
						/>)}
					</Card.Body>
				</Card>
			</Col>
		</>
	)
}
