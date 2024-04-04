import React from "react";
import Styles from "../styles/newLoading.module.scss"

const NewLoader = () => {
	return (
		<>
			<div className={Styles.parent}>
				{/* <Spinner animation="grow" /> */}
				<div className={Styles.body}>
					<div className={`${Styles.wheel} ${Styles.front}`}></div>
					<div className={`${Styles.wheel} ${Styles.back}`}></div>
				</div>
				<div className={`${Styles.cover}`}>
					<div className={`${Styles.path}`}></div>
				</div>
				<div className={`${Styles.text}`}>Please Wait...</div>
			</div>
		</>
	);
};
export default NewLoader;
