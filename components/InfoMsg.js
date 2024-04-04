
export default function InfoMsg({ msg }) {
	return (

		<div className='d-flex justify-content-center flex-column align-items-center my-5'>
			<div>
				<svg fill="#246c66" width="35px" height="35px" viewBox="0 0 52 52" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><rect height="6" rx="3" transform="translate(52 27.52) rotate(180)" width="6" x="23" y="10.76" /><path d="M27,41.24a2,2,0,0,1-2-2v-13H23a2,2,0,0,1,0-4h4a2,2,0,0,1,2,2v15A2,2,0,0,1,27,41.24Z" /><path d="M26,52A26,26,0,1,1,52,26,26,26,0,0,1,26,52ZM26,4A22,22,0,1,0,48,26,22,22,0,0,0,26,4Z" /></svg>
			</div>
			<h5 className='mt-3'>{msg}</h5>

		</div>
	)
}
