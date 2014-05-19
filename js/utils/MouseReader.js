function MouseReader(element) {

	this.element = element;
	this.x = 0;
	this.y = 0;
	this.click = false;

	this.startRead = function() {
		var reader = this;
		var read = $(this.element).mousemove(
				function(event) {

					var verticalDiff = 0;
					var horizontalDiff = 0;

					$(this).parents().each(function() {
						verticalDiff += $(this).scrollTop();
						horizontalDiff += $(this).scrollLeft();
					});

					verticalDiff -= $(this).scrollTop();
					horizontalDiff -= $(this).scrollLeft();

					reader.setX((event.pageX - (document.getElementById($(this)
							.prop('id')).offsetLeft - pageXOffset))
							- horizontalDiff);
					reader.setY((event.pageY - (document.getElementById($(this)
							.prop('id')).offsetTop - pageYOffset))
							- verticalDiff);
				});
		$(this.element).mousemove();
		$(this.element).mousedown(function() {
			reader.click = true;
		});

		$(this.element).mouseup(function() {
			reader.click = false;
		});
	};

	this.stopRead = function() {
		$(this.element).mousemove(function() {
		});
	};

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.setX = function(x) {
		this.x = x;
	};

	this.setY = function(y) {
		this.y = y;
	};

	this.getElement = function() {
		return this.element;
	};

	this.setElement = function(element) {
		this.stopRead();
		this.element = element;
	};

	this.pressed = function() {
		return this.click;
	};
}