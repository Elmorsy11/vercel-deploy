import axios from 'axios';
import { Formik } from 'formik'
import { fetchAllIncentiveHistory } from 'helpers/helpers';
import { custodyTranieeStatistcs } from 'lib/slices/custodies';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Select from "react-select";
import { useState } from 'react';
import { useEffect } from 'react';
import Image from "next/image";
import iconGift from "/public/gift 1.svg";
const ModifyLvlForm = ({ showInsentiveHistoryTable, handleClose, setInsentiveHistoryData, setInsentiveLoading }) => {
    const router = useRouter();
    const dispatch = useDispatch()
    const traineeID = router?.query?.traineeId;
    const session = useSession()
    const token = session[0]?.user.token
    const [lvlOptions, setLvlOptions] = useState([])
    const initialValues = {
        level: 0,

    };
    useEffect(() => {
        axios.get(`incentive/getMaxLevel/${traineeID}`).then((res) => {
            setLvlOptions(res.data.availableLevels)
        })
    }, []);

    const usersNum = JSON.parse(localStorage.getItem("TotalUsers") ?? "{}")
    // Check if the user is in the activeUsers or offlineUsers array
    const activeUserIndex = usersNum?.activeUsers?.findIndex(user => user._id === traineeID);
    const userStatus = activeUserIndex !== -1 ? "activeUsers" : "offlineUsers"
    const options = lvlOptions?.map(({ level, points }) => {
        return {
            value:
                +level,
            label: (
                <div className="d-flex justify-content-between align-items-center" >
                    <span className="fs-6 text-dark fw-bold"  > Level {level} </span>
                    <div className="d-flex align-items-center">
                        <Image src={iconGift} width={20} height={20} />
                        <span className="ms-2 rounded fw-bold" style={{ color: "#3668e9", padding: "5px 10px", background: "#D9E3F3", minWidth: "90px" }}>
                            {points} Points
                        </span>

                    </div>
                </div>
            )
        }

    })

    const onModifyLvlHandler = async ({ level }, { resetForm }) => {
        try {
            axios(
                `/incentive/modifyTraineeLevel`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    data: {
                        traineeId: traineeID,
                        level
                    },
                }
            )
                .then((res) => {
                    if (res?.status === 200) {
                        toast.success(' Level Modified successfully')
                        dispatch(custodyTranieeStatistcs({ traineeID }));
                        resetForm()
                        handleClose()
                        localStorage.setItem("TotalUsers", JSON.stringify({
                            ...usersNum,
                            [userStatus]: usersNum[userStatus].map((user) => {
                                return user._id === traineeID ? { ...user, totalPoints: res.data.totalPoints } : user
                            })
                        }));
                        if (showInsentiveHistoryTable) {
                            fetchAllIncentiveHistory(traineeID, token, setInsentiveHistoryData, setInsentiveLoading)
                        }

                    }

                })

        } catch (error) {
            setSubmitting(false);
            toast.error(error?.data?.enMessage);
        }


    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onModifyLvlHandler}
        >
            {({
                handleSubmit,
                setFieldValue
            }) => {
                return (
                    <Form noValidate onSubmit={handleSubmit} >

                        <Select options={options} onChange={(({ value }) => setFieldValue("level", value))}
                            placeholder="Select Level"
                        />

                        <div className="d-flex mt-3  justify-content-end">
                            <button type="submit" className="main__button-table"  >
                                Save Changes
                            </button>
                        </div>

                    </Form>
                )
            }}
        </Formik>
    )
}

export default ModifyLvlForm