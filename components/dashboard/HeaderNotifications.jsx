import { setAllNotificationSeen, setNotifiySeen } from 'lib/slices/notificationSlice';
import { Dropdown } from 'react-bootstrap';
import { IoIosNotificationsOutline } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'

const HeaderNotifications = () => {
    const { notificationsCount, shownNotifications } = useSelector(state => state.violationsNotifications)
    const dispatch = useDispatch()

    return (
        <Dropdown as="li" className="nav-item d-flex align-items-center dropdown-icon">
            <Dropdown.Toggle
                variant=" d-flex align-items-center"
                id="notifications-drop"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className="notifications position-relative zindex-tooltip"
            >
                <IoIosNotificationsOutline style={{ fontSize: "25px", color: "#575757" }} />
                {notificationsCount > 0 && (<span className='notifications-count position-absolute'> {notificationsCount < 25 ? notificationsCount : "+25"}  </span>)}

            </Dropdown.Toggle>
            <Dropdown.Menu
                className="sub-drop dropdown-menu-end p-0 "
                aria-labelledby="notifications-drop"
            >
                <div className='position-relative d-flex align-items-center justify-content-center'  >

                    <div className='notifications-container position-absolute  top-0'>
                        <h3 className='position-sticky top-0 notification-title px-3 position-relative text-white fs-5 d-flex justify-content-between'>
                            <span>Notifications                            </span>
                            {shownNotifications.length > 0 && <button className='  bg-transparent  align-self-center text-white text-decoration-underline lh-1' onClick={() => dispatch(setAllNotificationSeen())}
                                style={{ fontSize: "12px" }}

                            >
                                Mark all as read
                            </button>}
                        </h3>
                        <div className='notification-inner'>
                            {shownNotifications.length ? shownNotifications.map((item) => {
                                return <div className='w-100 px-3 py-1 gap-2 d-flex  notification-inner-content' key={item?.data?.user._id}
                                    style={{ background: item.isSeen ? "#fff" : "#fac8c861", borderRightColor: item.isSeen ? "" : "#ff3838" }}
                                    onClick={() => dispatch(setNotifiySeen(item?.data?.user._id))}    >
                                    <div className='py-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2.62635C6.83064 2.62635 2.62502 6.83197 2.62502 12.0013C2.62502 17.1707 6.83064 21.3763 12 21.3763C17.1694 21.3763 21.375 17.1707 21.375 12.0013C21.375 6.83197 17.1694 2.62635 12 2.62635ZM12 6.4701C12.2411 6.4701 12.4767 6.54158 12.6771 6.67549C12.8775 6.80941 13.0337 6.99975 13.126 7.22245C13.2182 7.44515 13.2424 7.6902 13.1953 7.92661C13.1483 8.16303 13.0322 8.38019 12.8618 8.55063C12.6913 8.72108 12.4742 8.83715 12.2378 8.88418C12.0014 8.9312 11.7563 8.90707 11.5336 8.81483C11.3109 8.72258 11.1206 8.56637 10.9867 8.36595C10.8527 8.16553 10.7813 7.92989 10.7813 7.68885C10.7813 7.36561 10.9097 7.05562 11.1382 6.82706C11.3668 6.5985 11.6768 6.4701 12 6.4701ZM14.25 17.0638H10.125C9.9261 17.0638 9.73533 16.9848 9.59468 16.8442C9.45403 16.7035 9.37501 16.5128 9.37501 16.3138C9.37501 16.1149 9.45403 15.9242 9.59468 15.7835C9.73533 15.6429 9.9261 15.5638 10.125 15.5638H11.4375V11.4388H10.6875C10.4886 11.4388 10.2978 11.3598 10.1572 11.2192C10.0165 11.0785 9.93751 10.8878 9.93751 10.6888C9.93751 10.4899 10.0165 10.2992 10.1572 10.1585C10.2978 10.0179 10.4886 9.93885 10.6875 9.93885H12.1875C12.3864 9.93885 12.5772 10.0179 12.7178 10.1585C12.8585 10.2992 12.9375 10.4899 12.9375 10.6888V15.5638H14.25C14.4489 15.5638 14.6397 15.6429 14.7803 15.7835C14.921 15.9242 15 16.1149 15 16.3138C15 16.5128 14.921 16.7035 14.7803 16.8442C14.6397 16.9848 14.4489 17.0638 14.25 17.0638Z" fill="#E10000" />
                                        </svg>
                                    </div>
                                    <div className='inner-info py-2'>
                                        <span className='d-flex gap-2 align-items-center'>
                                            {item.data?.user?.username}
                                        </span>
                                        <span>  {item.data?.newData?.IsOverSpeed && "Over speed violation" || item.data?.newData?.SeatBelt && "Seat Belt violation"} </span>
                                    </div>
                                </div>
                            }) : <p className='text-center p-2 fw-bold text-capitalize text-dark'> There is no notification yet</p>}
                        </div>
                    </div>
                </div>
            </Dropdown.Menu>
        </Dropdown>

    )
}


export default HeaderNotifications