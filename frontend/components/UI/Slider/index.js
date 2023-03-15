import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import ArrowBtn from './ArrowBtn';
import Pagination from './Pagination';
import { SLIDES_ON_DESKTOP } from '@utils/constants';

function Slider({
	children,
	smallBtn,
	slideOnMobile = 1,
	slideOnTablet = 2,
	slideOnPc = 3,
}) {
	const [loaded, setLoaded] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [sliderRef, instanceRef] = useKeenSlider({
		breakpoints: {
			'(max-width: 768px)': {
				slides: { perView: slideOnMobile, spacing: 8 },
			},
			'(min-width: 768px)': {
				slides: { perView: slideOnTablet, spacing: 16 },
			},
			'(min-width: 1024px)': {
				slides: { perView: slideOnPc, spacing: 24 },
			},
		},
		created: () => {
			setLoaded(true);
		},
		slideChanged(slider) {
			setCurrentSlide(slider.track.details.rel);
		},
	});
	const [limit, setLimit] = useState(null);

	const handleNext = useCallback(() => {
		instanceRef.current?.next();
	}, [loaded, instanceRef]);

	const handlePrev = useCallback(() => {
		instanceRef.current?.prev();
	}, [loaded, instanceRef]);

	useEffect(() => {
		const handleKeyPress = (e) => {
			loaded && e.key === 'ArrowRight' && handleNext();
			loaded && e.key === 'ArrowLeft' && handlePrev();
		};
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [loaded]);

	const onResize = useCallback(() => {
		if (window) {
			const w = window.innerWidth;
			w < 768 && setLimit(slideOnMobile);
			w > 768 && w < 1024 && setLimit(slideOnTablet);
		}
	});

	useLayoutEffect(() => {
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, [limit]);

	useEffect(() => {
		onResize();
	}, []);

	return (
		<section className="container mt-9 relative">
			<div
				ref={sliderRef}
				className="keen-slider"
			>
				{children}
				{/* button on pc */}
				{loaded && children.length > SLIDES_ON_DESKTOP && (
					<>
						<ArrowBtn
							onClick={handlePrev}
							disabled={currentSlide === 0}
							smallBtn={smallBtn}
						/>
						<ArrowBtn
							right
							smallBtn={smallBtn}
							onClick={handleNext}
							disabled={
								currentSlide ===
								children.length - SLIDES_ON_DESKTOP
							}
						/>
					</>
				)}
			</div>

			{/* pagination on tablet mobile */}
			{loaded && limit && (
				<Pagination
					dots={
						limit === 2
							? instanceRef.current.slides.length - 1
							: instanceRef.current.slides.length
					}
					currentSlide={currentSlide}
					handleGoTo={instanceRef.current?.moveToIdx}
				/>
			)}
		</section>
	);
}

export default Slider;
