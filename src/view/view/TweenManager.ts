class TweenManager {
	public static tweenList: TweenBody[][] = [
		[
			new TweenBody().setPoint(0.62, 0.4).setScale(1.3),
			new TweenBody().setPoint(0.52, 0.45).setScale(1.4),
			new TweenBody().setPoint(0.5, 0.5),
			new TweenBody().setDelay(2000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setPoint(0.45, 0.5).setScale(1.2),
			new TweenBody().setPoint(0.5, 0.5).setScale(1.3).setTime(3000),
			new TweenBody().setDelay(1000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setPoint(0.52, 0.52).setScale(1.3),
			new TweenBody().setPoint(0.5, 0.5).setScale(1).setTime(3000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setPoint(0.55, 0.55).setScale(1.2),
			new TweenBody().setPoint(0.45, 0.45).setScale(1.2).setTime(3000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setPoint(0.45, 0.5).setScale(1.2),
			new TweenBody().setPoint(0.55, 0.5).setScale(1.2).setTime(3000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setPoint(0.52, 0.52).setScale(1.2),
			new TweenBody().setPoint(0.48, 0.48).setScale(1.1).setTime(3000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setPoint(0.45, 0.5).setScale(1.2),
			new TweenBody().setPoint(0.52, 0.5).setScale(1.3).setTime(3000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setPoint(0.55, 0.5).setScale(1.2),
			new TweenBody().setPoint(0.45, 0.5).setScale(1.2).setTime(3000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		],
		[
			new TweenBody().setScale(1.2),
			new TweenBody().setScale(1).setTime(3000).setNext(true),
			new TweenBody().setAlpha(0).setTime(500)
		]
	];
}