function MouseReader(element) {
	this.element = element;
	this.x = 0;
	this.y = 0;
	
	this.startRead = function() {
		var reader = this;
		$(this.element).mousemove(
				function(event) {
					var vd = 0;
					var hd = 0;

					$(this).parents().each(function() {
						vd += $(this).scrollTop();
						hd += $(this).scrollLeft();
					});

					vd -= $(this).scrollTop();
					hd -= $(this).scrollLeft();

					reader.setX((event.pageX - (document.getElementById($(this)
							.prop('id')).offsetLeft - pageXOffset))
							- hd);
					reader.setY((event.pageY - (document.getElementById($(this)
							.prop('id')).offsetTop - pageYOffset))
							- vd);
				});

		$(this.element).mousemove();
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
}