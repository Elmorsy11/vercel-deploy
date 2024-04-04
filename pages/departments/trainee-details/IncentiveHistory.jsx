import React, { useMemo } from 'react'
import AgGridDT from "components/AgGridDT";
import SkeletonLoader from 'components/skeleton-loader';
import { Card } from 'react-bootstrap';

const IncentiveHistory = ({ data, loading }) => {
    const getRowStyle = () => {
        return {
            position: "relative",
            transform: "translateY(0)",
            marginBottom: "5px",
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
        };
    };

    const keys = useMemo(() => {

        if (data.length) return Object?.keys(data[0]);
    }, [data]);

    // Table Columns
    const columns = useMemo(() => {
        if (data.length) {
            const newColumns = keys?.map((key) => {
                const column = {};
                keys.forEach((k) => {
                    column["headerName"] = key.toUpperCase();
                    column["field"] = key;
                    column["minWidth"] = 250;
                });
                return column;
            });
            return newColumns;
        }
    }, [data]);


    return loading ? (
        <Card
            bg="light-blue"
            key={"Dark"}
            text={"Dark"}
            style={{
                background: "#EAEEF3",
                border: "none",
                height: "200px !important  ",
            }}
            className="mb-2 py-2 min-box hover h-100 mx-2"
        >
            <Card.Body
                style={{
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <SkeletonLoader card />
            </Card.Body>
        </Card>
    ) : (
        <AgGridDT columnDefs={columns} rowData={data} getRowStyle={getRowStyle} />


    )
}


export default IncentiveHistory