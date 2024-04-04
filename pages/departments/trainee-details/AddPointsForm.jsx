import axios from 'axios';
import { Formik } from 'formik'
import { fetchAllIncentiveHistory } from 'helpers/helpers';
import { custodyTranieeStatistcs } from 'lib/slices/custodies';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AddPointsForm = ({ showInsentiveHistoryTable, handleClose, setInsentiveHistoryData, setInsentiveLoading }) => {
    const router = useRouter();
    const dispatch = useDispatch()
    const traineeID = router?.query?.traineeId;
    const session = useSession()
    const token = session[0]?.user.token
    const initialValues = {
        points: '',
    };

    const usersNum = JSON.parse(localStorage.getItem("TotalUsers") ?? "{}")

    // Check if the user is in the activeUsers or offlineUsers array
    const activeUserIndex = usersNum?.activeUsers?.findIndex(user => user._id === traineeID);

    const userStatus = activeUserIndex !== -1 ? "activeUsers" : "offlineUsers"

    const onAddPointsHandler = async ({ points }, { resetForm }) => {

        try {
            if (points !== 0 && points !== "") {
                const respond = await axios(
                    `/incentive/addSpecialPoints`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        data: {
                            traineeId: traineeID,
                            pointsToAdd: points
                        },
                    }
                )
                if (respond?.status === 200) {
                    toast.success('points added successfully')
                    resetForm()
                    handleClose()
                    dispatch(custodyTranieeStatistcs({ traineeID }));
                    // mapping for update totalPoints at specific obj
                    localStorage.setItem("TotalUsers", JSON.stringify({
                        ...usersNum,
                        [userStatus]: usersNum[userStatus].map((user) => {
                            return user._id === traineeID ? { ...user, totalPoints: user?.totalPoints + points } : user
                        })
                    }));

                    if (showInsentiveHistoryTable) {
                        fetchAllIncentiveHistory(traineeID, token, setInsentiveHistoryData, setInsentiveLoading)
                    }
                }
            } else {
                toast.error("Please insert a value");
            }

        } catch (error) {
            toast.error(error?.response?.data?.enMessage);
            setSubmitting(false);
        }


    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onAddPointsHandler}
        >
            {({
                values,
                handleChange,
                handleBlur,
                handleSubmit
            }) => {
                return (
                    <Form noValidate onSubmit={handleSubmit}   >
                        <Form.Control
                            type="number"
                            id="points"
                            name="points"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.points}
                            placeholder="Enter Your Points"
                            min="5"
                            max="10"

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

export default AddPointsForm