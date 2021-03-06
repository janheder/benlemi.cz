(function ($) {
  $.fn.unveil = function (threshold, callback) {
    var $w = $(window),
      th = threshold || 0,
      retina = window.devicePixelRatio > 1,
      attrib = retina ? "data-src-retina" : "data-src",
      images = this,
      loaded;
    this.one("unveil", function () {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });
    function unveil() {
      var inview = images.filter(function () {
        var $e = $(this);
        if ($e.is(":hidden")) return;
        var wt = $w.scrollTop(),
          wb = wt + $w.height(),
          et = $e.offset().top,
          eb = et + $e.height();
        return eb >= wt - th && et <= wb + th;
      });
      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }
    $w.on("scroll.unveil resize.unveil lookup.unveil load.unveil", unveil);
    unveil();
    return this;
  };
})(window.jQuery || window.Zepto);

+(function ($) {
  "use strict";
  function transitionEnd() {
    var el = document.createElement("bootstrap");
    var transEndEventNames = {
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "oTransitionEnd otransitionend",
      transition: "transitionend",
    };
    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }
    return false;
  }
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one("bsTransitionEnd", function () {
      called = true;
    });
    var callback = function () {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };
  $(function () {
    $.support.transition = transitionEnd();
    if (!$.support.transition) return;
    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this))
          return e.handleObj.handler.apply(this, arguments);
      },
    };
  });
})(jQuery);

+(function ($) {
  "use strict";
  var Carousel = function (element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find(".carousel-indicators");
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;
    this.options.keyboard &&
      this.$element.on("keydown.bs.carousel", $.proxy(this.keydown, this));
    this.options.pause == "hover" &&
      !("ontouchstart" in document.documentElement) &&
      this.$element
        .on("mouseenter.bs.carousel", $.proxy(this.pause, this))
        .on("mouseleave.bs.carousel", $.proxy(this.cycle, this));
  };
  Carousel.VERSION = "3.3.5";
  Carousel.TRANSITION_DURATION = 600;
  Carousel.DEFAULTS = {
    interval: 5e3,
    pause: "hover",
    wrap: true,
    keyboard: true,
  };
  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();
        break;
      case 39:
        this.next();
        break;
      default:
        return;
    }
    e.preventDefault();
  };
  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);
    this.interval && clearInterval(this.interval);
    this.options.interval &&
      !this.paused &&
      (this.interval = setInterval(
        $.proxy(this.next, this),
        this.options.interval
      ));
    return this;
  };
  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children(".item");
    return this.$items.index(item || this.$active);
  };
  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap =
      (direction == "prev" && activeIndex === 0) ||
      (direction == "next" && activeIndex == this.$items.length - 1);
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == "prev" ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };
  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(
      (this.$active = this.$element.find(".item.active"))
    );
    if (pos > this.$items.length - 1 || pos < 0) return;
    if (this.sliding)
      return this.$element.one("slid.bs.carousel", function () {
        that.to(pos);
      });
    if (activeIndex == pos) return this.pause().cycle();
    return this.slide(pos > activeIndex ? "next" : "prev", this.$items.eq(pos));
  };
  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);
    if (this.$element.find(".next, .prev").length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }
    this.interval = clearInterval(this.interval);
    return this;
  };
  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide("next");
  };
  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide("prev");
  };
  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find(".item.active");
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == "next" ? "left" : "right";
    var that = this;
    if ($next.hasClass("active")) return (this.sliding = false);
    var relatedTarget = $next[0];
    var slideEvent = $.Event("slide.bs.carousel", {
      relatedTarget: relatedTarget,
      direction: direction,
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;
    this.sliding = true;
    isCycling && this.pause();
    if (this.$indicators.length) {
      this.$indicators.find(".active").removeClass("active");
      var $nextIndicator = $(
        this.$indicators.children()[this.getItemIndex($next)]
      );
      $nextIndicator && $nextIndicator.addClass("active");
    }
    var slidEvent = $.Event("slid.bs.carousel", {
      relatedTarget: relatedTarget,
      direction: direction,
    });
    if ($.support.transition && this.$element.hasClass("slide")) {
      $next.addClass(type);
      $next[0].offsetWidth;
      $active.addClass(direction);
      $next.addClass(direction);
      $active
        .one("bsTransitionEnd", function () {
          $next.removeClass([type, direction].join(" ")).addClass("active");
          $active.removeClass(["active", direction].join(" "));
          that.sliding = false;
          setTimeout(function () {
            that.$element.trigger(slidEvent);
          }, 0);
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass("active");
      $next.addClass("active");
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }
    isCycling && this.cycle();
    return this;
  };
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data("bs.carousel");
      var options = $.extend(
        {},
        Carousel.DEFAULTS,
        $this.data(),
        typeof option == "object" && option
      );
      var action = typeof option == "string" ? option : options.slide;
      if (!data)
        $this.data("bs.carousel", (data = new Carousel(this, options)));
      if (typeof option == "number") data.to(option);
      else if (action) data[action]();
      else if (options.interval) data.pause().cycle();
    });
  }
  var old = $.fn.carousel;
  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;
  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };
  var clickHandler = function (e) {
    var href;
    var $this = $(this);
    var $target = $(
      $this.attr("data-target") ||
        ((href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""))
    );
    if (!$target.hasClass("carousel")) return;
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr("data-slide-to");
    if (slideIndex) options.interval = false;
    Plugin.call($target, options);
    if (slideIndex) {
      $target.data("bs.carousel").to(slideIndex);
    }
    e.preventDefault();
  };
  $(document)
    .on("click.bs.carousel.data-api", "[data-slide]", clickHandler)
    .on("click.bs.carousel.data-api", "[data-slide-to]", clickHandler);
  $(window).on("load", function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
})(jQuery);

+(function ($) {
  "use strict";
  var backdrop = ".dropdown-backdrop";
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function (element) {
    $(element).on("click.bs.dropdown", this.toggle);
  };
  Dropdown.VERSION = "3.3.5";
  function getParent($this) {
    var selector = $this.attr("data-target");
    if (!selector) {
      selector = $this.attr("href");
      selector =
        selector &&
        /#[A-Za-z]/.test(selector) &&
        selector.replace(/.*(?=#[^\s]*$)/, "");
    }
    var $parent = selector && $(selector);
    return $parent && $parent.length ? $parent : $this.parent();
  }
  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };
      if (!$parent.hasClass("open")) return;
      if (
        e &&
        e.type == "click" &&
        /input|textarea/i.test(e.target.tagName) &&
        $.contains($parent[0], e.target)
      )
        return;
      $parent.trigger((e = $.Event("hide.bs.dropdown", relatedTarget)));
      if (e.isDefaultPrevented()) return;
      $this.attr("aria-expanded", "false");
      $parent.removeClass("open").trigger("hidden.bs.dropdown", relatedTarget);
    });
  }
  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);
    if ($this.is(".disabled, :disabled")) return;
    var $parent = getParent($this);
    var isActive = $parent.hasClass("open");
    clearMenus();
    if (!isActive) {
      if (
        "ontouchstart" in document.documentElement &&
        !$parent.closest(".navbar-nav").length
      ) {
        $(document.createElement("div"))
          .addClass("dropdown-backdrop")
          .insertAfter($(this))
          .on("click", clearMenus);
      }
      var relatedTarget = { relatedTarget: this };
      $parent.trigger((e = $.Event("show.bs.dropdown", relatedTarget)));
      if (e.isDefaultPrevented()) return;
      $this.trigger("focus").attr("aria-expanded", "true");
      $parent.toggleClass("open").trigger("shown.bs.dropdown", relatedTarget);
    }
    return false;
  };
  Dropdown.prototype.keydown = function (e) {
    if (
      !/(38|40|27|32)/.test(e.which) ||
      /input|textarea/i.test(e.target.tagName)
    )
      return;
    var $this = $(this);
    e.preventDefault();
    e.stopPropagation();
    if ($this.is(".disabled, :disabled")) return;
    var $parent = getParent($this);
    var isActive = $parent.hasClass("open");
    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger("focus");
      return $this.trigger("click");
    }
    var desc = " li:not(.disabled):visible a";
    var $items = $parent.find(".dropdown-menu" + desc);
    if (!$items.length) return;
    var index = $items.index(e.target);
    if (e.which == 38 && index > 0) index--;
    if (e.which == 40 && index < $items.length - 1) index++;
    if (!~index) index = 0;
    $items.eq(index).trigger("focus");
  };
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data("bs.dropdown");
      if (!data) $this.data("bs.dropdown", (data = new Dropdown(this)));
      if (typeof option == "string") data[option].call($this);
    });
  }
  var old = $.fn.dropdown;
  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;
  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };
  $(document)
    .on("click.bs.dropdown.data-api", clearMenus)
    .on("click.bs.dropdown.data-api", ".dropdown form", function (e) {
      e.stopPropagation();
    })
    .on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle)
    .on("keydown.bs.dropdown.data-api", toggle, Dropdown.prototype.keydown)
    .on(
      "keydown.bs.dropdown.data-api",
      ".dropdown-menu",
      Dropdown.prototype.keydown
    );
})(jQuery);

+(function ($) {
  "use strict";
  var Tab = function (element) {
    this.element = $(element);
  };
  Tab.VERSION = "3.3.5";
  Tab.TRANSITION_DURATION = 150;
  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest("ul:not(.dropdown-menu)");
    var selector = $this.data("target");
    if (!selector) {
      selector = $this.attr("href");
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
    }
    if ($this.parent("li").hasClass("active")) return;
    var $previous = $ul.find(".active:last a");
    var hideEvent = $.Event("hide.bs.tab", { relatedTarget: $this[0] });
    var showEvent = $.Event("show.bs.tab", { relatedTarget: $previous[0] });
    $previous.trigger(hideEvent);
    $this.trigger(showEvent);
    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented())
      return;
    var $target = $(selector);
    this.activate($this.closest("li"), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({ type: "hidden.bs.tab", relatedTarget: $this[0] });
      $this.trigger({ type: "shown.bs.tab", relatedTarget: $previous[0] });
    });
  };
  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find("> .active");
    var transition =
      callback &&
      $.support.transition &&
      (($active.length && $active.hasClass("fade")) ||
        !!container.find("> .fade").length);
    function next() {
      $active
        .removeClass("active")
        .find("> .dropdown-menu > .active")
        .removeClass("active")
        .end()
        .find('[data-toggle="tab"]')
        .attr("aria-expanded", false);
      element
        .addClass("active")
        .find('[data-toggle="tab"]')
        .attr("aria-expanded", true);
      if (transition) {
        element[0].offsetWidth;
        element.addClass("in");
      } else {
        element.removeClass("fade");
      }
      if (element.parent(".dropdown-menu").length) {
        element
          .closest("li.dropdown")
          .addClass("active")
          .end()
          .find('[data-toggle="tab"]')
          .attr("aria-expanded", true);
      }
      callback && callback();
    }
    $active.length && transition
      ? $active
          .one("bsTransitionEnd", next)
          .emulateTransitionEnd(Tab.TRANSITION_DURATION)
      : next();
    $active.removeClass("in");
  };
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data("bs.tab");
      if (!data) $this.data("bs.tab", (data = new Tab(this)));
      if (typeof option == "string") data[option]();
    });
  }
  var old = $.fn.tab;
  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;
  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };
  var clickHandler = function (e) {
    e.preventDefault();
    Plugin.call($(this), "show");
  };
  $(document)
    .on("click.bs.tab.data-api", '[data-toggle="tab"]', clickHandler)
    .on("click.bs.tab.data-api", '[data-toggle="pill"]', clickHandler);
})(jQuery);

+(function ($) {
  "use strict";
  var Tooltip = function (element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;
    this.init("tooltip", element, options);
  };
  Tooltip.VERSION = "3.3.5";
  Tooltip.TRANSITION_DURATION = 150;
  Tooltip.DEFAULTS = {
    animation: true,
    placement: "top",
    selector: false,
    template:
      '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: "hover focus",
    title: "",
    delay: 0,
    html: false,
    container: false,
    viewport: { selector: "body", padding: 0 },
  };
  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport =
      this.options.viewport &&
      $(
        $.isFunction(this.options.viewport)
          ? this.options.viewport.call(this, this.$element)
          : this.options.viewport.selector || this.options.viewport
      );
    this.inState = { click: false, hover: false, focus: false };
    if (
      this.$element[0] instanceof document.constructor &&
      !this.options.selector
    ) {
      throw new Error(
        "`selector` option must be specified when initializing " +
          this.type +
          " on the window.document object!"
      );
    }
    var triggers = this.options.trigger.split(" ");
    for (var i = triggers.length; i--; ) {
      var trigger = triggers[i];
      if (trigger == "click") {
        this.$element.on(
          "click." + this.type,
          this.options.selector,
          $.proxy(this.toggle, this)
        );
      } else if (trigger != "manual") {
        var eventIn = trigger == "hover" ? "mouseenter" : "focusin";
        var eventOut = trigger == "hover" ? "mouseleave" : "focusout";
        this.$element.on(
          eventIn + "." + this.type,
          this.options.selector,
          $.proxy(this.enter, this)
        );
        this.$element.on(
          eventOut + "." + this.type,
          this.options.selector,
          $.proxy(this.leave, this)
        );
      }
    }
    this.options.selector
      ? (this._options = $.extend({}, this.options, {
          trigger: "manual",
          selector: "",
        }))
      : this.fixTitle();
  };
  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };
  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);
    if (options.delay && typeof options.delay == "number") {
      options.delay = { show: options.delay, hide: options.delay };
    }
    return options;
  };
  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();
    this._options &&
      $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value;
      });
    return options;
  };
  Tooltip.prototype.enter = function (obj) {
    var self =
      obj instanceof this.constructor
        ? obj
        : $(obj.currentTarget).data("bs." + this.type);
    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data("bs." + this.type, self);
    }
    if (obj instanceof $.Event) {
      self.inState[obj.type == "focusin" ? "focus" : "hover"] = true;
    }
    if (self.tip().hasClass("in") || self.hoverState == "in") {
      self.hoverState = "in";
      return;
    }
    clearTimeout(self.timeout);
    self.hoverState = "in";
    if (!self.options.delay || !self.options.delay.show) return self.show();
    self.timeout = setTimeout(function () {
      if (self.hoverState == "in") self.show();
    }, self.options.delay.show);
  };
  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }
    return false;
  };
  Tooltip.prototype.leave = function (obj) {
    var self =
      obj instanceof this.constructor
        ? obj
        : $(obj.currentTarget).data("bs." + this.type);
    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data("bs." + this.type, self);
    }
    if (obj instanceof $.Event) {
      self.inState[obj.type == "focusout" ? "focus" : "hover"] = false;
    }
    if (self.isInStateTrue()) return;
    clearTimeout(self.timeout);
    self.hoverState = "out";
    if (!self.options.delay || !self.options.delay.hide) return self.hide();
    self.timeout = setTimeout(function () {
      if (self.hoverState == "out") self.hide();
    }, self.options.delay.hide);
  };
  Tooltip.prototype.show = function () {
    var e = $.Event("show.bs." + this.type);
    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);
      var inDom = $.contains(
        this.$element[0].ownerDocument.documentElement,
        this.$element[0]
      );
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;
      var $tip = this.tip();
      var tipId = this.getUID(this.type);
      this.setContent();
      $tip.attr("id", tipId);
      this.$element.attr("aria-describedby", tipId);
      if (this.options.animation) $tip.addClass("fade");
      var placement =
        typeof this.options.placement == "function"
          ? this.options.placement.call(this, $tip[0], this.$element[0])
          : this.options.placement;
      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, "") || "top";
      $tip
        .detach()
        .css({ top: 0, left: 0, display: "block" })
        .addClass(placement)
        .data("bs." + this.type, this);
      this.options.container
        ? $tip.appendTo(this.options.container)
        : $tip.insertAfter(this.$element);
      this.$element.trigger("inserted.bs." + this.type);
      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;
      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);
        placement =
          placement == "bottom" &&
          pos.bottom + actualHeight > viewportDim.bottom
            ? "top"
            : placement == "top" && pos.top - actualHeight < viewportDim.top
            ? "bottom"
            : placement == "right" &&
              pos.right + actualWidth > viewportDim.width
            ? "left"
            : placement == "left" && pos.left - actualWidth < viewportDim.left
            ? "right"
            : placement;
        $tip.removeClass(orgPlacement).addClass(placement);
      }
      var calculatedOffset = this.getCalculatedOffset(
        placement,
        pos,
        actualWidth,
        actualHeight
      );
      this.applyPlacement(calculatedOffset, placement);
      var complete = function () {
        var prevHoverState = that.hoverState;
        that.$element.trigger("shown.bs." + that.type);
        that.hoverState = null;
        if (prevHoverState == "out") that.leave(that);
      };
      $.support.transition && this.$tip.hasClass("fade")
        ? $tip
            .one("bsTransitionEnd", complete)
            .emulateTransitionEnd(Tooltip.TRANSITION_DURATION)
        : complete();
    }
  };
  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;
    var marginTop = parseInt($tip.css("margin-top"), 10);
    var marginLeft = parseInt($tip.css("margin-left"), 10);
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;
    offset.top += marginTop;
    offset.left += marginLeft;
    $.offset.setOffset(
      $tip[0],
      $.extend(
        {
          using: function (props) {
            $tip.css({
              top: Math.round(props.top),
              left: Math.round(props.left),
            });
          },
        },
        offset
      ),
      0
    );
    $tip.addClass("in");
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;
    if (placement == "top" && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }
    var delta = this.getViewportAdjustedDelta(
      placement,
      offset,
      actualWidth,
      actualHeight
    );
    if (delta.left) offset.left += delta.left;
    else offset.top += delta.top;
    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical
      ? delta.left * 2 - width + actualWidth
      : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? "offsetWidth" : "offsetHeight";
    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };
  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? "left" : "top", 50 * (1 - delta / dimension) + "%")
      .css(isVertical ? "top" : "left", "");
  };
  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title);
    $tip.removeClass("fade in top bottom left right");
  };
  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event("hide.bs." + this.type);
    function complete() {
      if (that.hoverState != "in") $tip.detach();
      that.$element
        .removeAttr("aria-describedby")
        .trigger("hidden.bs." + that.type);
      callback && callback();
    }
    this.$element.trigger(e);
    if (e.isDefaultPrevented()) return;
    $tip.removeClass("in");
    $.support.transition && $tip.hasClass("fade")
      ? $tip
          .one("bsTransitionEnd", complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION)
      : complete();
    this.hoverState = null;
    return this;
  };
  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr("title") || typeof $e.attr("data-original-title") != "string") {
      $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
    }
  };
  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };
  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;
    var el = $element[0];
    var isBody = el.tagName == "BODY";
    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      elRect = $.extend({}, elRect, {
        width: elRect.right - elRect.left,
        height: elRect.bottom - elRect.top,
      });
    }
    var elOffset = isBody ? { top: 0, left: 0 } : $element.offset();
    var scroll = {
      scroll: isBody
        ? document.documentElement.scrollTop || document.body.scrollTop
        : $element.scrollTop(),
    };
    var outerDims = isBody
      ? { width: $(window).width(), height: $(window).height() }
      : null;
    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };
  Tooltip.prototype.getCalculatedOffset = function (
    placement,
    pos,
    actualWidth,
    actualHeight
  ) {
    return placement == "bottom"
      ? {
          top: pos.top + pos.height,
          left: pos.left + pos.width / 2 - actualWidth / 2,
        }
      : placement == "top"
      ? {
          top: pos.top - actualHeight,
          left: pos.left + pos.width / 2 - actualWidth / 2,
        }
      : placement == "left"
      ? {
          top: pos.top + pos.height / 2 - actualHeight / 2,
          left: pos.left - actualWidth,
        }
      : {
          top: pos.top + pos.height / 2 - actualHeight / 2,
          left: pos.left + pos.width,
        };
  };
  Tooltip.prototype.getViewportAdjustedDelta = function (
    placement,
    pos,
    actualWidth,
    actualHeight
  ) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;
    var viewportPadding =
      (this.options.viewport && this.options.viewport.padding) || 0;
    var viewportDimensions = this.getPosition(this.$viewport);
    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset =
        pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (
        bottomEdgeOffset >
        viewportDimensions.top + viewportDimensions.height
      ) {
        delta.top =
          viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        delta.left =
          viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }
    return delta;
  };
  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;
    title =
      $e.attr("data-original-title") ||
      (typeof o.title == "function" ? o.title.call($e[0]) : o.title);
    return title;
  };
  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~~(Math.random() * 1e6);
    } while (document.getElementById(prefix));
    return prefix;
  };
  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(
          this.type +
            " `template` option must consist of exactly 1 top-level element!"
        );
      }
    }
    return this.$tip;
  };
  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
  };
  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };
  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };
  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };
  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data("bs." + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data("bs." + this.type, self);
      }
    }
    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);
      else self.leave(self);
    } else {
      self.tip().hasClass("in") ? self.leave(self) : self.enter(self);
    }
  };
  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off("." + that.type).removeData("bs." + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
    });
  };
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data("bs.tooltip");
      var options = typeof option == "object" && option;
      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data("bs.tooltip", (data = new Tooltip(this, options)));
      if (typeof option == "string") data[option]();
    });
  }
  var old = $.fn.tooltip;
  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;
  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
})(jQuery);

/*!
 * jQuery UI Core @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.ui = $.ui || {};
  $.extend($.ui, {
    version: "@VERSION",
    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38,
    },
    safeActiveElement: function (document) {
      var activeElement;
      try {
        activeElement = document.activeElement;
      } catch (error) {
        activeElement = document.body;
      }
      if (!activeElement) {
        activeElement = document.body;
      }
      if (!activeElement.nodeName) {
        activeElement = document.body;
      }
      return activeElement;
    },
    safeBlur: function (element) {
      if (element && element.nodeName.toLowerCase() !== "body") {
        $(element).trigger("blur");
      }
    },
    escapeSelector: (function () {
      var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
      return function (selector) {
        return selector.replace(selectorEscape, "\\$1");
      };
    })(),
  });
  $.fn.extend({
    scrollParent: function (includeHidden) {
      var position = this.css("position"),
        excludeStaticParent = position === "absolute",
        overflowRegex = includeHidden
          ? /(auto|scroll|hidden)/
          : /(auto|scroll)/,
        scrollParent = this.parents()
          .filter(function () {
            var parent = $(this);
            if (excludeStaticParent && parent.css("position") === "static") {
              return false;
            }
            return overflowRegex.test(
              parent.css("overflow") +
                parent.css("overflow-y") +
                parent.css("overflow-x")
            );
          })
          .eq(0);
      return position === "fixed" || !scrollParent.length
        ? $(this[0].ownerDocument || document)
        : scrollParent;
    },
    uniqueId: (function () {
      var uuid = 0;
      return function () {
        return this.each(function () {
          if (!this.id) {
            this.id = "ui-id-" + ++uuid;
          }
        });
      };
    })(),
    removeUniqueId: function () {
      return this.each(function () {
        if (/^ui-id-\d+$/.test(this.id)) {
          $(this).removeAttr("id");
        }
      });
    },
    form: function () {
      return typeof this[0].form === "string"
        ? this.closest("form")
        : $(this[0].form);
    },
    labels: function () {
      var ancestor, selector, id, labels, ancestors;
      if (this[0].labels && this[0].labels.length) {
        return this.pushStack(this[0].labels);
      }
      labels = this.eq(0).parents("label");
      id = this.attr("id");
      if (id) {
        ancestor = this.eq(0).parents().last();
        ancestors = ancestor.add(
          ancestor.length ? ancestor.siblings() : this.siblings()
        );
        selector = "label[for='" + $.ui.escapeSelector(id) + "']";
        labels = labels.add(ancestors.find(selector).addBack(selector));
      }
      return this.pushStack(labels);
    },
  });
  function focusable(element, hasTabindex) {
    var map,
      mapName,
      img,
      nodeName = element.nodeName.toLowerCase();
    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }
      img = $("img[usemap='#" + mapName + "']")[0];
      return !!img && visible(img);
    }
    return (
      (/^(input|select|textarea|button|object)$/.test(nodeName)
        ? !element.disabled
        : "a" === nodeName
        ? element.href || hasTabindex
        : hasTabindex) && visible(element)
    );
  }
  function visible(element) {
    return (
      $.expr.filters.visible(element) &&
      !$(element)
        .parents()
        .addBack()
        .filter(function () {
          return $.css(this, "visibility") === "hidden";
        }).length
    );
  }
  $.extend($.expr[":"], {
    data: $.expr.createPseudo
      ? $.expr.createPseudo(function (dataName) {
          return function (elem) {
            return !!$.data(elem, dataName);
          };
        })
      : function (elem, i, match) {
          return !!$.data(elem, match[3]);
        },
    focusable: function (element) {
      return focusable(element, $.attr(element, "tabindex") != null);
    },
    tabbable: function (element) {
      var tabIndex = $.attr(element, "tabindex"),
        hasTabindex = tabIndex != null;
      return (!hasTabindex || tabIndex >= 0) && focusable(element, hasTabindex);
    },
  });
  if ($.fn.jquery.substring(0, 3) === "1.7") {
    $.each(["Width", "Height"], function (i, name) {
      var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
        type = name.toLowerCase(),
        orig = {
          innerWidth: $.fn.innerWidth,
          innerHeight: $.fn.innerHeight,
          outerWidth: $.fn.outerWidth,
          outerHeight: $.fn.outerHeight,
        };
      function reduce(elem, size, border, margin) {
        $.each(side, function () {
          size -= parseFloat($.css(elem, "padding" + this)) || 0;
          if (border) {
            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
          }
          if (margin) {
            size -= parseFloat($.css(elem, "margin" + this)) || 0;
          }
        });
        return size;
      }
      $.fn["inner" + name] = function (size) {
        if (size === undefined) {
          return orig["inner" + name].call(this);
        }
        return this.each(function () {
          $(this).css(type, reduce(this, size) + "px");
        });
      };
      $.fn["outer" + name] = function (size, margin) {
        if (typeof size !== "number") {
          return orig["outer" + name].call(this, size);
        }
        return this.each(function () {
          $(this).css(type, reduce(this, size, true, margin) + "px");
        });
      };
    });
    $.fn.addBack = function (selector) {
      return this.add(
        selector == null ? this.prevObject : this.prevObject.filter(selector)
      );
    };
  }
  $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
  $.fn.extend({
    disableSelection: (function () {
      var eventType =
        "onselectstart" in document.createElement("div")
          ? "selectstart"
          : "mousedown";
      return function () {
        return this.on(eventType + ".ui-disableSelection", function (event) {
          event.preventDefault();
        });
      };
    })(),
    enableSelection: function () {
      return this.off(".ui-disableSelection");
    },
  });
  $.ui.plugin = {
    add: function (module, option, set) {
      var i,
        proto = $.ui[module].prototype;
      for (i in set) {
        proto.plugins[i] = proto.plugins[i] || [];
        proto.plugins[i].push([option, set[i]]);
      }
    },
    call: function (instance, name, args, allowDisconnected) {
      var i,
        set = instance.plugins[name];
      if (!set) {
        return;
      }
      if (
        !allowDisconnected &&
        (!instance.element[0].parentNode ||
          instance.element[0].parentNode.nodeType === 11)
      ) {
        return;
      }
      for (i = 0; i < set.length; i++) {
        if (instance.options[set[i][0]]) {
          set[i][1].apply(instance.element, args);
        }
      }
    },
  };
});

/*!
 * jQuery UI Widget @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  var widget_uuid = 0,
    widget_slice = Array.prototype.slice;
  $.cleanData = (function (orig) {
    return function (elems) {
      var events, elem, i;
      for (i = 0; (elem = elems[i]) != null; i++) {
        try {
          events = $._data(elem, "events");
          if (events && events.remove) {
            $(elem).triggerHandler("remove");
          }
        } catch (e) {}
      }
      orig(elems);
    };
  })($.cleanData);
  $.widget = function (name, base, prototype) {
    var fullName,
      existingConstructor,
      constructor,
      basePrototype,
      proxiedPrototype = {},
      namespace = name.split(".")[0];
    name = name.split(".")[1];
    fullName = namespace + "-" + name;
    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }
    if ($.isArray(prototype)) {
      prototype = $.extend.apply(null, [{}].concat(prototype));
    }
    $.expr[":"][fullName.toLowerCase()] = function (elem) {
      return !!$.data(elem, fullName);
    };
    $[namespace] = $[namespace] || {};
    existingConstructor = $[namespace][name];
    constructor = $[namespace][name] = function (options, element) {
      if (!this._createWidget) {
        return new constructor(options, element);
      }
      if (arguments.length) {
        this._createWidget(options, element);
      }
    };
    $.extend(constructor, existingConstructor, {
      version: prototype.version,
      _proto: $.extend({}, prototype),
      _childConstructors: [],
    });
    basePrototype = new base();
    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function (prop, value) {
      if (!$.isFunction(value)) {
        proxiedPrototype[prop] = value;
        return;
      }
      proxiedPrototype[prop] = (function () {
        var _super = function () {
            return base.prototype[prop].apply(this, arguments);
          },
          _superApply = function (args) {
            return base.prototype[prop].apply(this, args);
          };
        return function () {
          var __super = this._super,
            __superApply = this._superApply,
            returnValue;
          this._super = _super;
          this._superApply = _superApply;
          returnValue = value.apply(this, arguments);
          this._super = __super;
          this._superApply = __superApply;
          return returnValue;
        };
      })();
    });
    constructor.prototype = $.widget.extend(
      basePrototype,
      {
        widgetEventPrefix: existingConstructor
          ? basePrototype.widgetEventPrefix || name
          : name,
      },
      proxiedPrototype,
      {
        constructor: constructor,
        namespace: namespace,
        widgetName: name,
        widgetFullName: fullName,
      }
    );
    if (existingConstructor) {
      $.each(existingConstructor._childConstructors, function (i, child) {
        var childPrototype = child.prototype;
        $.widget(
          childPrototype.namespace + "." + childPrototype.widgetName,
          constructor,
          child._proto
        );
      });
      delete existingConstructor._childConstructors;
    } else {
      base._childConstructors.push(constructor);
    }
    $.widget.bridge(name, constructor);
    return constructor;
  };
  $.widget.extend = function (target) {
    var input = widget_slice.call(arguments, 1),
      inputIndex = 0,
      inputLength = input.length,
      key,
      value;
    for (; inputIndex < inputLength; inputIndex++) {
      for (key in input[inputIndex]) {
        value = input[inputIndex][key];
        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
          if ($.isPlainObject(value)) {
            target[key] = $.isPlainObject(target[key])
              ? $.widget.extend({}, target[key], value)
              : $.widget.extend({}, value);
          } else {
            target[key] = value;
          }
        }
      }
    }
    return target;
  };
  $.widget.bridge = function (name, object) {
    var fullName = object.prototype.widgetFullName || name;
    $.fn[name] = function (options) {
      var isMethodCall = typeof options === "string",
        args = widget_slice.call(arguments, 1),
        returnValue = this;
      if (isMethodCall) {
        this.each(function () {
          var methodValue,
            instance = $.data(this, fullName);
          if (options === "instance") {
            returnValue = instance;
            return false;
          }
          if (!instance) {
            return $.error(
              "cannot call methods on " +
                name +
                " prior to initialization; " +
                "attempted to call method '" +
                options +
                "'"
            );
          }
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            return $.error(
              "no such method '" +
                options +
                "' for " +
                name +
                " widget instance"
            );
          }
          methodValue = instance[options].apply(instance, args);
          if (methodValue !== instance && methodValue !== undefined) {
            returnValue =
              methodValue && methodValue.jquery
                ? returnValue.pushStack(methodValue.get())
                : methodValue;
            return false;
          }
        });
      } else {
        if (args.length) {
          options = $.widget.extend.apply(null, [options].concat(args));
        }
        this.each(function () {
          var instance = $.data(this, fullName);
          if (instance) {
            instance.option(options || {});
            if (instance._init) {
              instance._init();
            }
          } else {
            $.data(this, fullName, new object(options, this));
          }
        });
      }
      return returnValue;
    };
  };
  $.Widget = function () {};
  $.Widget._childConstructors = [];
  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: { classes: {}, disabled: false, create: null },
    _createWidget: function (options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      this.uuid = widget_uuid++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();
      this.classesElementLookup = {};
      if (element !== this) {
        $.data(element, this.widgetFullName, this);
        this._on(true, this.element, {
          remove: function (event) {
            if (event.target === element) {
              this.destroy();
            }
          },
        });
        this.document = $(
          element.style ? element.ownerDocument : element.document || element
        );
        this.window = $(
          this.document[0].defaultView || this.document[0].parentWindow
        );
      }
      this.options = $.widget.extend(
        {},
        this.options,
        this._getCreateOptions(),
        options
      );
      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: $.noop,
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,
    destroy: function () {
      var that = this;
      this._destroy();
      $.each(this.classesElementLookup, function (key, value) {
        that._removeClass(value, key);
      });
      this.element.off(this.eventNamespace).removeData(this.widgetFullName);
      this.widget().off(this.eventNamespace).removeAttr("aria-disabled");
      this.bindings.off(this.eventNamespace);
    },
    _destroy: $.noop,
    widget: function () {
      return this.element;
    },
    option: function (key, value) {
      var options = key,
        parts,
        curOption,
        i;
      if (arguments.length === 0) {
        return $.widget.extend({}, this.options);
      }
      if (typeof key === "string") {
        options = {};
        parts = key.split(".");
        key = parts.shift();
        if (parts.length) {
          curOption = options[key] = $.widget.extend({}, this.options[key]);
          for (i = 0; i < parts.length - 1; i++) {
            curOption[parts[i]] = curOption[parts[i]] || {};
            curOption = curOption[parts[i]];
          }
          key = parts.pop();
          if (arguments.length === 1) {
            return curOption[key] === undefined ? null : curOption[key];
          }
          curOption[key] = value;
        } else {
          if (arguments.length === 1) {
            return this.options[key] === undefined ? null : this.options[key];
          }
          options[key] = value;
        }
      }
      this._setOptions(options);
      return this;
    },
    _setOptions: function (options) {
      var key;
      for (key in options) {
        this._setOption(key, options[key]);
      }
      return this;
    },
    _setOption: function (key, value) {
      if (key === "classes") {
        this._setOptionClasses(value);
      }
      this.options[key] = value;
      if (key === "disabled") {
        this._toggleClass(
          this.widget(),
          this.widgetFullName + "-disabled",
          null,
          !!value
        );
        if (value) {
          this._removeClass(this.hoverable, null, "ui-state-hover");
          this._removeClass(this.focusable, null, "ui-state-focus");
        }
      }
      return this;
    },
    _setOptionClasses: function (value) {
      var classKey, elements, currentElements;
      for (classKey in value) {
        currentElements = this.classesElementLookup[classKey];
        if (
          value[classKey] === this.options.classes[classKey] ||
          !currentElements ||
          !currentElements.length
        ) {
          continue;
        }
        elements = $(currentElements.get());
        this._removeClass(currentElements, classKey);
        elements.addClass(
          this._classes({
            element: elements,
            keys: classKey,
            classes: value,
            add: true,
          })
        );
      }
    },
    enable: function () {
      return this._setOptions({ disabled: false });
    },
    disable: function () {
      return this._setOptions({ disabled: true });
    },
    _classes: function (options) {
      var full = [],
        that = this;
      options = $.extend(
        { element: this.element, classes: this.options.classes || {} },
        options
      );
      function processClassString(classes, checkOption) {
        var current, i;
        for (i = 0; i < classes.length; i++) {
          current = that.classesElementLookup[classes[i]] || $();
          if (options.add) {
            current = $($.unique(current.get().concat(options.element.get())));
          } else {
            current = $(current.not(options.element).get());
          }
          that.classesElementLookup[classes[i]] = current;
          full.push(classes[i]);
          if (checkOption && options.classes[classes[i]]) {
            full.push(options.classes[classes[i]]);
          }
        }
      }
      if (options.keys) {
        processClassString(options.keys.match(/\S+/g) || [], true);
      }
      if (options.extra) {
        processClassString(options.extra.match(/\S+/g) || []);
      }
      return full.join(" ");
    },
    _removeClass: function (element, keys, extra) {
      return this._toggleClass(element, keys, extra, false);
    },
    _addClass: function (element, keys, extra) {
      return this._toggleClass(element, keys, extra, true);
    },
    _toggleClass: function (element, keys, extra, add) {
      add = typeof add === "boolean" ? add : extra;
      var shift = typeof element === "string" || element === null,
        options = {
          extra: shift ? keys : extra,
          keys: shift ? element : keys,
          element: shift ? this.element : element,
          add: add,
        };
      options.element.toggleClass(this._classes(options), add);
      return this;
    },
    _on: function (suppressDisabledCheck, element, handlers) {
      var delegateElement,
        instance = this;
      if (typeof suppressDisabledCheck !== "boolean") {
        handlers = element;
        element = suppressDisabledCheck;
        suppressDisabledCheck = false;
      }
      if (!handlers) {
        handlers = element;
        element = this.element;
        delegateElement = this.widget();
      } else {
        element = delegateElement = $(element);
        this.bindings = this.bindings.add(element);
      }
      $.each(handlers, function (event, handler) {
        function handlerProxy() {
          if (
            !suppressDisabledCheck &&
            (instance.options.disabled === true ||
              $(this).hasClass("ui-state-disabled"))
          ) {
            return;
          }
          return (typeof handler === "string"
            ? instance[handler]
            : handler
          ).apply(instance, arguments);
        }
        if (typeof handler !== "string") {
          handlerProxy.guid = handler.guid =
            handler.guid || handlerProxy.guid || $.guid++;
        }
        var match = event.match(/^([\w:-]*)\s*(.*)$/),
          eventName = match[1] + instance.eventNamespace,
          selector = match[2];
        if (selector) {
          delegateElement.on(eventName, selector, handlerProxy);
        } else {
          element.on(eventName, handlerProxy);
        }
      });
    },
    _off: function (element, eventName) {
      eventName =
        (eventName || "").split(" ").join(this.eventNamespace + " ") +
        this.eventNamespace;
      element.off(eventName).off(eventName);
      this.bindings = $(this.bindings.not(element).get());
      this.focusable = $(this.focusable.not(element).get());
      this.hoverable = $(this.hoverable.not(element).get());
    },
    _delay: function (handler, delay) {
      function handlerProxy() {
        return (typeof handler === "string"
          ? instance[handler]
          : handler
        ).apply(instance, arguments);
      }
      var instance = this;
      return setTimeout(handlerProxy, delay || 0);
    },
    _hoverable: function (element) {
      this.hoverable = this.hoverable.add(element);
      this._on(element, {
        mouseenter: function (event) {
          this._addClass($(event.currentTarget), null, "ui-state-hover");
        },
        mouseleave: function (event) {
          this._removeClass($(event.currentTarget), null, "ui-state-hover");
        },
      });
    },
    _focusable: function (element) {
      this.focusable = this.focusable.add(element);
      this._on(element, {
        focusin: function (event) {
          this._addClass($(event.currentTarget), null, "ui-state-focus");
        },
        focusout: function (event) {
          this._removeClass($(event.currentTarget), null, "ui-state-focus");
        },
      });
    },
    _trigger: function (type, event, data) {
      var prop,
        orig,
        callback = this.options[type];
      data = data || {};
      event = $.Event(event);
      event.type = (type === this.widgetEventPrefix
        ? type
        : this.widgetEventPrefix + type
      ).toLowerCase();
      event.target = this.element[0];
      orig = event.originalEvent;
      if (orig) {
        for (prop in orig) {
          if (!(prop in event)) {
            event[prop] = orig[prop];
          }
        }
      }
      this.element.trigger(event, data);
      return !(
        ($.isFunction(callback) &&
          callback.apply(this.element[0], [event].concat(data)) === false) ||
        event.isDefaultPrevented()
      );
    },
  };
  $.each({ show: "fadeIn", hide: "fadeOut" }, function (method, defaultEffect) {
    $.Widget.prototype["_" + method] = function (element, options, callback) {
      if (typeof options === "string") {
        options = { effect: options };
      }
      var hasOptions,
        effectName = !options
          ? method
          : options === true || typeof options === "number"
          ? defaultEffect
          : options.effect || defaultEffect;
      options = options || {};
      if (typeof options === "number") {
        options = { duration: options };
      }
      hasOptions = !$.isEmptyObject(options);
      options.complete = callback;
      if (options.delay) {
        element.delay(options.delay);
      }
      if (hasOptions && $.effects && $.effects.effect[effectName]) {
        element[method](options);
      } else if (effectName !== method && element[effectName]) {
        element[effectName](options.duration, options.easing, callback);
      } else {
        element.queue(function (next) {
          $(this)[method]();
          if (callback) {
            callback.call(element[0]);
          }
          next();
        });
      }
    };
  });
  return $.widget;
});

/*!
 * jQuery UI Mouse @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./widget"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  var mouseHandled = false;
  $(document).on("mouseup", function () {
    mouseHandled = false;
  });
  return $.widget("ui.mouse", {
    version: "@VERSION",
    options: {
      cancel: "input, textarea, button, select, option",
      distance: 1,
      delay: 0,
    },
    _mouseInit: function () {
      var that = this;
      this.element
        .on("mousedown." + this.widgetName, function (event) {
          return that._mouseDown(event);
        })
        .on("click." + this.widgetName, function (event) {
          if (
            true ===
            $.data(event.target, that.widgetName + ".preventClickEvent")
          ) {
            $.removeData(event.target, that.widgetName + ".preventClickEvent");
            event.stopImmediatePropagation();
            return false;
          }
        });
      this.started = false;
    },
    _mouseDestroy: function () {
      this.element.off("." + this.widgetName);
      if (this._mouseMoveDelegate) {
        this.document
          .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
          .off("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },
    _mouseDown: function (event) {
      if (mouseHandled) {
        return;
      }
      this._mouseMoved = false;
      this._mouseStarted && this._mouseUp(event);
      this._mouseDownEvent = event;
      var that = this,
        btnIsLeft = event.which === 1,
        elIsCancel =
          typeof this.options.cancel === "string" && event.target.nodeName
            ? $(event.target).closest(this.options.cancel).length
            : false;
      if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
        return true;
      }
      this.mouseDelayMet = !this.options.delay;
      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function () {
          that.mouseDelayMet = true;
        }, this.options.delay);
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = this._mouseStart(event) !== false;
        if (!this._mouseStarted) {
          event.preventDefault();
          return true;
        }
      }
      if (
        true === $.data(event.target, this.widgetName + ".preventClickEvent")
      ) {
        $.removeData(event.target, this.widgetName + ".preventClickEvent");
      }
      this._mouseMoveDelegate = function (event) {
        return that._mouseMove(event);
      };
      this._mouseUpDelegate = function (event) {
        return that._mouseUp(event);
      };
      this.document
        .on("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .on("mouseup." + this.widgetName, this._mouseUpDelegate);
      event.preventDefault();
      mouseHandled = true;
      return true;
    },
    _mouseMove: function (event) {
      if (this._mouseMoved) {
        if (
          $.ui.ie &&
          (!document.documentMode || document.documentMode < 9) &&
          !event.button
        ) {
          return this._mouseUp(event);
        } else if (!event.which) {
          return this._mouseUp(event);
        }
      }
      if (event.which || event.button) {
        this._mouseMoved = true;
      }
      if (this._mouseStarted) {
        this._mouseDrag(event);
        return event.preventDefault();
      }
      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted =
          this._mouseStart(this._mouseDownEvent, event) !== false;
        this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event);
      }
      return !this._mouseStarted;
    },
    _mouseUp: function (event) {
      this.document
        .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .off("mouseup." + this.widgetName, this._mouseUpDelegate);
      if (this._mouseStarted) {
        this._mouseStarted = false;
        if (event.target === this._mouseDownEvent.target) {
          $.data(event.target, this.widgetName + ".preventClickEvent", true);
        }
        this._mouseStop(event);
      }
      mouseHandled = false;
      return false;
    },
    _mouseDistanceMet: function (event) {
      return (
        Math.max(
          Math.abs(this._mouseDownEvent.pageX - event.pageX),
          Math.abs(this._mouseDownEvent.pageY - event.pageY)
        ) >= this.options.distance
      );
    },
    _mouseDelayMet: function () {
      return this.mouseDelayMet;
    },
    _mouseStart: function () {},
    _mouseDrag: function () {},
    _mouseStop: function () {},
    _mouseCapture: function () {
      return true;
    },
  });
});

/*!
 * jQuery UI Position @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  (function () {
    $.ui = $.ui || {};
    var cachedScrollbarWidth,
      supportsOffsetFractions,
      max = Math.max,
      abs = Math.abs,
      round = Math.round,
      rhorizontal = /left|center|right/,
      rvertical = /top|center|bottom/,
      roffset = /[\+\-]\d+(\.[\d]+)?%?/,
      rposition = /^\w+/,
      rpercent = /%$/,
      _position = $.fn.position;
    supportsOffsetFractions = function () {
      var element = $("<div>")
          .css("position", "absolute")
          .appendTo("body")
          .offset({ top: 1.5, left: 1.5 }),
        support = element.offset().top === 1.5;
      element.remove();
      supportsOffsetFractions = function () {
        return support;
      };
      return support;
    };
    function getOffsets(offsets, width, height) {
      return [
        parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1),
        parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1),
      ];
    }
    function parseCss(element, property) {
      return parseInt($.css(element, property), 10) || 0;
    }
    function getDimensions(elem) {
      var raw = elem[0];
      if (raw.nodeType === 9) {
        return {
          width: elem.width(),
          height: elem.height(),
          offset: { top: 0, left: 0 },
        };
      }
      if ($.isWindow(raw)) {
        return {
          width: elem.width(),
          height: elem.height(),
          offset: { top: elem.scrollTop(), left: elem.scrollLeft() },
        };
      }
      if (raw.preventDefault) {
        return {
          width: 0,
          height: 0,
          offset: { top: raw.pageY, left: raw.pageX },
        };
      }
      return {
        width: elem.outerWidth(),
        height: elem.outerHeight(),
        offset: elem.offset(),
      };
    }
    $.position = {
      scrollbarWidth: function () {
        if (cachedScrollbarWidth !== undefined) {
          return cachedScrollbarWidth;
        }
        var w1,
          w2,
          div = $(
            "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"
          ),
          innerDiv = div.children()[0];
        $("body").append(div);
        w1 = innerDiv.offsetWidth;
        div.css("overflow", "scroll");
        w2 = innerDiv.offsetWidth;
        if (w1 === w2) {
          w2 = div[0].clientWidth;
        }
        div.remove();
        return (cachedScrollbarWidth = w1 - w2);
      },
      getScrollInfo: function (within) {
        var overflowX =
            within.isWindow || within.isDocument
              ? ""
              : within.element.css("overflow-x"),
          overflowY =
            within.isWindow || within.isDocument
              ? ""
              : within.element.css("overflow-y"),
          hasOverflowX =
            overflowX === "scroll" ||
            (overflowX === "auto" &&
              within.width < within.element[0].scrollWidth),
          hasOverflowY =
            overflowY === "scroll" ||
            (overflowY === "auto" &&
              within.height < within.element[0].scrollHeight);
        return {
          width: hasOverflowY ? $.position.scrollbarWidth() : 0,
          height: hasOverflowX ? $.position.scrollbarWidth() : 0,
        };
      },
      getWithinInfo: function (element) {
        var withinElement = $(element || window),
          isWindow = $.isWindow(withinElement[0]),
          isDocument = !!withinElement[0] && withinElement[0].nodeType === 9;
        return {
          element: withinElement,
          isWindow: isWindow,
          isDocument: isDocument,
          offset: withinElement.offset() || { left: 0, top: 0 },
          scrollLeft: withinElement.scrollLeft(),
          scrollTop: withinElement.scrollTop(),
          width: withinElement.outerWidth(),
          height: withinElement.outerHeight(),
        };
      },
    };
    $.fn.position = function (options) {
      if (!options || !options.of) {
        return _position.apply(this, arguments);
      }
      options = $.extend({}, options);
      var atOffset,
        targetWidth,
        targetHeight,
        targetOffset,
        basePosition,
        dimensions,
        target = $(options.of),
        within = $.position.getWithinInfo(options.within),
        scrollInfo = $.position.getScrollInfo(within),
        collision = (options.collision || "flip").split(" "),
        offsets = {};
      dimensions = getDimensions(target);
      if (target[0].preventDefault) {
        options.at = "left top";
      }
      targetWidth = dimensions.width;
      targetHeight = dimensions.height;
      targetOffset = dimensions.offset;
      basePosition = $.extend({}, targetOffset);
      $.each(["my", "at"], function () {
        var pos = (options[this] || "").split(" "),
          horizontalOffset,
          verticalOffset;
        if (pos.length === 1) {
          pos = rhorizontal.test(pos[0])
            ? pos.concat(["center"])
            : rvertical.test(pos[0])
            ? ["center"].concat(pos)
            : ["center", "center"];
        }
        pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
        pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";
        horizontalOffset = roffset.exec(pos[0]);
        verticalOffset = roffset.exec(pos[1]);
        offsets[this] = [
          horizontalOffset ? horizontalOffset[0] : 0,
          verticalOffset ? verticalOffset[0] : 0,
        ];
        options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]];
      });
      if (collision.length === 1) {
        collision[1] = collision[0];
      }
      if (options.at[0] === "right") {
        basePosition.left += targetWidth;
      } else if (options.at[0] === "center") {
        basePosition.left += targetWidth / 2;
      }
      if (options.at[1] === "bottom") {
        basePosition.top += targetHeight;
      } else if (options.at[1] === "center") {
        basePosition.top += targetHeight / 2;
      }
      atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
      basePosition.left += atOffset[0];
      basePosition.top += atOffset[1];
      return this.each(function () {
        var collisionPosition,
          using,
          elem = $(this),
          elemWidth = elem.outerWidth(),
          elemHeight = elem.outerHeight(),
          marginLeft = parseCss(this, "marginLeft"),
          marginTop = parseCss(this, "marginTop"),
          collisionWidth =
            elemWidth +
            marginLeft +
            parseCss(this, "marginRight") +
            scrollInfo.width,
          collisionHeight =
            elemHeight +
            marginTop +
            parseCss(this, "marginBottom") +
            scrollInfo.height,
          position = $.extend({}, basePosition),
          myOffset = getOffsets(
            offsets.my,
            elem.outerWidth(),
            elem.outerHeight()
          );
        if (options.my[0] === "right") {
          position.left -= elemWidth;
        } else if (options.my[0] === "center") {
          position.left -= elemWidth / 2;
        }
        if (options.my[1] === "bottom") {
          position.top -= elemHeight;
        } else if (options.my[1] === "center") {
          position.top -= elemHeight / 2;
        }
        position.left += myOffset[0];
        position.top += myOffset[1];
        if (!supportsOffsetFractions()) {
          position.left = round(position.left);
          position.top = round(position.top);
        }
        collisionPosition = { marginLeft: marginLeft, marginTop: marginTop };
        $.each(["left", "top"], function (i, dir) {
          if ($.ui.position[collision[i]]) {
            $.ui.position[collision[i]][dir](position, {
              targetWidth: targetWidth,
              targetHeight: targetHeight,
              elemWidth: elemWidth,
              elemHeight: elemHeight,
              collisionPosition: collisionPosition,
              collisionWidth: collisionWidth,
              collisionHeight: collisionHeight,
              offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
              my: options.my,
              at: options.at,
              within: within,
              elem: elem,
            });
          }
        });
        if (options.using) {
          using = function (props) {
            var left = targetOffset.left - position.left,
              right = left + targetWidth - elemWidth,
              top = targetOffset.top - position.top,
              bottom = top + targetHeight - elemHeight,
              feedback = {
                target: {
                  element: target,
                  left: targetOffset.left,
                  top: targetOffset.top,
                  width: targetWidth,
                  height: targetHeight,
                },
                element: {
                  element: elem,
                  left: position.left,
                  top: position.top,
                  width: elemWidth,
                  height: elemHeight,
                },
                horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle",
              };
            if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
              feedback.horizontal = "center";
            }
            if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
              feedback.vertical = "middle";
            }
            if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
              feedback.important = "horizontal";
            } else {
              feedback.important = "vertical";
            }
            options.using.call(this, props, feedback);
          };
        }
        elem.offset($.extend(position, { using: using }));
      });
    };
    $.ui.position = {
      fit: {
        left: function (position, data) {
          var within = data.within,
            withinOffset = within.isWindow
              ? within.scrollLeft
              : within.offset.left,
            outerWidth = within.width,
            collisionPosLeft =
              position.left - data.collisionPosition.marginLeft,
            overLeft = withinOffset - collisionPosLeft,
            overRight =
              collisionPosLeft +
              data.collisionWidth -
              outerWidth -
              withinOffset,
            newOverRight;
          if (data.collisionWidth > outerWidth) {
            if (overLeft > 0 && overRight <= 0) {
              newOverRight =
                position.left +
                overLeft +
                data.collisionWidth -
                outerWidth -
                withinOffset;
              position.left += overLeft - newOverRight;
            } else if (overRight > 0 && overLeft <= 0) {
              position.left = withinOffset;
            } else {
              if (overLeft > overRight) {
                position.left = withinOffset + outerWidth - data.collisionWidth;
              } else {
                position.left = withinOffset;
              }
            }
          } else if (overLeft > 0) {
            position.left += overLeft;
          } else if (overRight > 0) {
            position.left -= overRight;
          } else {
            position.left = max(
              position.left - collisionPosLeft,
              position.left
            );
          }
        },
        top: function (position, data) {
          var within = data.within,
            withinOffset = within.isWindow
              ? within.scrollTop
              : within.offset.top,
            outerHeight = data.within.height,
            collisionPosTop = position.top - data.collisionPosition.marginTop,
            overTop = withinOffset - collisionPosTop,
            overBottom =
              collisionPosTop +
              data.collisionHeight -
              outerHeight -
              withinOffset,
            newOverBottom;
          if (data.collisionHeight > outerHeight) {
            if (overTop > 0 && overBottom <= 0) {
              newOverBottom =
                position.top +
                overTop +
                data.collisionHeight -
                outerHeight -
                withinOffset;
              position.top += overTop - newOverBottom;
            } else if (overBottom > 0 && overTop <= 0) {
              position.top = withinOffset;
            } else {
              if (overTop > overBottom) {
                position.top =
                  withinOffset + outerHeight - data.collisionHeight;
              } else {
                position.top = withinOffset;
              }
            }
          } else if (overTop > 0) {
            position.top += overTop;
          } else if (overBottom > 0) {
            position.top -= overBottom;
          } else {
            position.top = max(position.top - collisionPosTop, position.top);
          }
        },
      },
      flip: {
        left: function (position, data) {
          var within = data.within,
            withinOffset = within.offset.left + within.scrollLeft,
            outerWidth = within.width,
            offsetLeft = within.isWindow
              ? within.scrollLeft
              : within.offset.left,
            collisionPosLeft =
              position.left - data.collisionPosition.marginLeft,
            overLeft = collisionPosLeft - offsetLeft,
            overRight =
              collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
            myOffset =
              data.my[0] === "left"
                ? -data.elemWidth
                : data.my[0] === "right"
                ? data.elemWidth
                : 0,
            atOffset =
              data.at[0] === "left"
                ? data.targetWidth
                : data.at[0] === "right"
                ? -data.targetWidth
                : 0,
            offset = -2 * data.offset[0],
            newOverRight,
            newOverLeft;
          if (overLeft < 0) {
            newOverRight =
              position.left +
              myOffset +
              atOffset +
              offset +
              data.collisionWidth -
              outerWidth -
              withinOffset;
            if (newOverRight < 0 || newOverRight < abs(overLeft)) {
              position.left += myOffset + atOffset + offset;
            }
          } else if (overRight > 0) {
            newOverLeft =
              position.left -
              data.collisionPosition.marginLeft +
              myOffset +
              atOffset +
              offset -
              offsetLeft;
            if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
              position.left += myOffset + atOffset + offset;
            }
          }
        },
        top: function (position, data) {
          var within = data.within,
            withinOffset = within.offset.top + within.scrollTop,
            outerHeight = within.height,
            offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
            collisionPosTop = position.top - data.collisionPosition.marginTop,
            overTop = collisionPosTop - offsetTop,
            overBottom =
              collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
            top = data.my[1] === "top",
            myOffset = top
              ? -data.elemHeight
              : data.my[1] === "bottom"
              ? data.elemHeight
              : 0,
            atOffset =
              data.at[1] === "top"
                ? data.targetHeight
                : data.at[1] === "bottom"
                ? -data.targetHeight
                : 0,
            offset = -2 * data.offset[1],
            newOverTop,
            newOverBottom;
          if (overTop < 0) {
            newOverBottom =
              position.top +
              myOffset +
              atOffset +
              offset +
              data.collisionHeight -
              outerHeight -
              withinOffset;
            if (newOverBottom < 0 || newOverBottom < abs(overTop)) {
              position.top += myOffset + atOffset + offset;
            }
          } else if (overBottom > 0) {
            newOverTop =
              position.top -
              data.collisionPosition.marginTop +
              myOffset +
              atOffset +
              offset -
              offsetTop;
            if (newOverTop > 0 || abs(newOverTop) < overBottom) {
              position.top += myOffset + atOffset + offset;
            }
          }
        },
      },
      flipfit: {
        left: function () {
          $.ui.position.flip.left.apply(this, arguments);
          $.ui.position.fit.left.apply(this, arguments);
        },
        top: function () {
          $.ui.position.flip.top.apply(this, arguments);
          $.ui.position.fit.top.apply(this, arguments);
        },
      },
    };
  })();
  return $.ui.position;
});

/*!
 * jQuery UI Autocomplete @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./core", "./widget", "./position", "./menu"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.widget("ui.autocomplete", {
    version: "@VERSION",
    defaultElement: "<input>",
    options: {
      appendTo: null,
      autoFocus: false,
      delay: 300,
      minLength: 1,
      position: { my: "left top", at: "left bottom", collision: "none" },
      source: null,
      change: null,
      close: null,
      focus: null,
      open: null,
      response: null,
      search: null,
      select: null,
    },
    requestIndex: 0,
    pending: 0,
    _create: function () {
      var suppressKeyPress,
        suppressKeyPressRepeat,
        suppressInput,
        nodeName = this.element[0].nodeName.toLowerCase(),
        isTextarea = nodeName === "textarea",
        isInput = nodeName === "input";
      this.isMultiLine =
        isTextarea || (!isInput && this.element.prop("isContentEditable"));
      this.valueMethod = this.element[isTextarea || isInput ? "val" : "text"];
      this.isNewMenu = true;
      this._addClass("ui-autocomplete-input");
      this.element.attr("autocomplete", "off");
      this._on(this.element, {
        keydown: function (event) {
          if (this.element.prop("readOnly")) {
            suppressKeyPress = true;
            suppressInput = true;
            suppressKeyPressRepeat = true;
            return;
          }
          suppressKeyPress = false;
          suppressInput = false;
          suppressKeyPressRepeat = false;
          var keyCode = $.ui.keyCode;
          switch (event.keyCode) {
            case keyCode.PAGE_UP:
              suppressKeyPress = true;
              this._move("previousPage", event);
              break;
            case keyCode.PAGE_DOWN:
              suppressKeyPress = true;
              this._move("nextPage", event);
              break;
            case keyCode.UP:
              suppressKeyPress = true;
              this._keyEvent("previous", event);
              break;
            case keyCode.DOWN:
              suppressKeyPress = true;
              this._keyEvent("next", event);
              break;
            case keyCode.ENTER:
              if (this.menu.active) {
                suppressKeyPress = true;
                event.preventDefault();
                this.menu.select(event);
              }
              break;
            case keyCode.TAB:
              if (this.menu.active) {
                this.menu.select(event);
              }
              break;
            case keyCode.ESCAPE:
              if (this.menu.element.is(":visible")) {
                if (!this.isMultiLine) {
                  this._value(this.term);
                }
                this.close(event);
                event.preventDefault();
              }
              break;
            default:
              suppressKeyPressRepeat = true;
              this._searchTimeout(event);
              break;
          }
        },
        keypress: function (event) {
          if (suppressKeyPress) {
            suppressKeyPress = false;
            if (!this.isMultiLine || this.menu.element.is(":visible")) {
              event.preventDefault();
            }
            return;
          }
          if (suppressKeyPressRepeat) {
            return;
          }
          var keyCode = $.ui.keyCode;
          switch (event.keyCode) {
            case keyCode.PAGE_UP:
              this._move("previousPage", event);
              break;
            case keyCode.PAGE_DOWN:
              this._move("nextPage", event);
              break;
            case keyCode.UP:
              this._keyEvent("previous", event);
              break;
            case keyCode.DOWN:
              this._keyEvent("next", event);
              break;
          }
        },
        input: function (event) {
          if (suppressInput) {
            suppressInput = false;
            event.preventDefault();
            return;
          }
          this._searchTimeout(event);
        },
        focus: function () {
          this.selectedItem = null;
          this.previous = this._value();
        },
        blur: function (event) {
          if (this.cancelBlur) {
            delete this.cancelBlur;
            return;
          }
          clearTimeout(this.searching);
          this.close(event);
          this._change(event);
        },
      });
      this._initSource();
      this.menu = $("<ul>")
        .appendTo(this._appendTo())
        .menu({ role: null })
        .hide()
        .menu("instance");
      this._addClass(this.menu.element, "ui-autocomplete", "ui-front");
      this._on(this.menu.element, {
        mousedown: function (event) {
          event.preventDefault();
          this.cancelBlur = true;
          this._delay(function () {
            delete this.cancelBlur;
            if (this.element[0] !== $.ui.safeActiveElement(this.document[0])) {
              this.element.trigger("focus");
            }
          });
          var menuElement = this.menu.element[0];
          if (!$(event.target).closest(".ui-menu-item").length) {
            this._delay(function () {
              var that = this;
              this.document.one("mousedown", function (event) {
                if (
                  event.target !== that.element[0] &&
                  event.target !== menuElement &&
                  !$.contains(menuElement, event.target)
                ) {
                  that.close();
                }
              });
            });
          }
        },
        menufocus: function (event, ui) {
          var label, item;
          if (this.isNewMenu) {
            this.isNewMenu = false;
            if (
              event.originalEvent &&
              /^mouse/.test(event.originalEvent.type)
            ) {
              this.menu.trigger("blur");
              this.document.one("mousemove", function () {
                $(event.target).trigger(event.originalEvent);
              });
              return;
            }
          }
          item = ui.item.data("ui-autocomplete-item");
          if (false !== this._trigger("focus", event, { item: item })) {
            if (event.originalEvent && /^key/.test(event.originalEvent.type)) {
              this._value(item.value);
            }
          }
          label = ui.item.attr("aria-label") || item.value;
          if (label && $.trim(label).length) {
            this.liveRegion.children().hide();
            $("<div>").text(label).appendTo(this.liveRegion);
          }
        },
        menuselect: function (event, ui) {
          var item = ui.item.data("ui-autocomplete-item"),
            previous = this.previous;
          if (this.element[0] !== $.ui.safeActiveElement(this.document[0])) {
            this.element.trigger("focus");
            this.previous = previous;
            this._delay(function () {
              this.previous = previous;
              this.selectedItem = item;
            });
          }
          if (false !== this._trigger("select", event, { item: item })) {
            this._value(item.value);
          }
          this.term = this._value();
          this.close(event);
          this.selectedItem = item;
        },
      });
      this.liveRegion = $("<span>", {
        role: "status",
        "aria-live": "assertive",
        "aria-relevant": "additions",
      }).appendTo(this.document[0].body);
      this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible");
      this._on(this.window, {
        beforeunload: function () {
          this.element.removeAttr("autocomplete");
        },
      });
    },
    _destroy: function () {
      clearTimeout(this.searching);
      this.element.removeAttr("autocomplete");
      this.menu.element.remove();
      this.liveRegion.remove();
    },
    _setOption: function (key, value) {
      this._super(key, value);
      if (key === "source") {
        this._initSource();
      }
      if (key === "appendTo") {
        this.menu.element.appendTo(this._appendTo());
      }
      if (key === "disabled" && value && this.xhr) {
        this.xhr.abort();
      }
    },
    _appendTo: function () {
      var element = this.options.appendTo;
      if (element) {
        element =
          element.jquery || element.nodeType
            ? $(element)
            : this.document.find(element).eq(0);
      }
      if (!element || !element[0]) {
        element = this.element.closest(".ui-front, dialog");
      }
      if (!element.length) {
        element = this.document[0].body;
      }
      return element;
    },
    _initSource: function () {
      var array,
        url,
        that = this;
      if ($.isArray(this.options.source)) {
        array = this.options.source;
        this.source = function (request, response) {
          response($.ui.autocomplete.filter(array, request.term));
        };
      } else if (typeof this.options.source === "string") {
        url = this.options.source;
        this.source = function (request, response) {
          if (that.xhr) {
            that.xhr.abort();
          }
          that.xhr = $.ajax({
            url: url,
            data: request,
            dataType: "json",
            success: function (data) {
              response(data);
            },
            error: function () {
              response([]);
            },
          });
        };
      } else {
        this.source = this.options.source;
      }
    },
    _searchTimeout: function (event) {
      clearTimeout(this.searching);
      this.searching = this._delay(function () {
        var equalValues = this.term === this._value(),
          menuVisible = this.menu.element.is(":visible"),
          modifierKey =
            event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
        if (!equalValues || (equalValues && !menuVisible && !modifierKey)) {
          this.selectedItem = null;
          this.search(null, event);
        }
      }, this.options.delay);
    },
    search: function (value, event) {
      value = value != null ? value : this._value();
      this.term = this._value();
      if (value.length < this.options.minLength) {
        return this.close(event);
      }
      if (this._trigger("search", event) === false) {
        return;
      }
      return this._search(value);
    },
    _search: function (value) {
      this.pending++;
      this._addClass("ui-autocomplete-loading");
      this.cancelSearch = false;
      this.source({ term: value }, this._response());
    },
    _response: function () {
      var index = ++this.requestIndex;
      return $.proxy(function (content) {
        if (index === this.requestIndex) {
          this.__response(content);
        }
        this.pending--;
        if (!this.pending) {
          this._removeClass("ui-autocomplete-loading");
        }
      }, this);
    },
    __response: function (content) {
      if (content) {
        content = this._normalize(content);
      }
      this._trigger("response", null, { content: content });
      if (
        !this.options.disabled &&
        content &&
        content.length &&
        !this.cancelSearch
      ) {
        this._suggest(content);
        this._trigger("open");
      } else {
        this._close();
      }
    },
    close: function (event) {
      this.cancelSearch = true;
      this._close(event);
    },
    _close: function (event) {
      if (this.menu.element.is(":visible")) {
        this.menu.element.hide();
        this.menu.blur();
        this.isNewMenu = true;
        this._trigger("close", event);
      }
    },
    _change: function (event) {
      if (this.previous !== this._value()) {
        this._trigger("change", event, { item: this.selectedItem });
      }
    },
    _normalize: function (items) {
      if (items.length && items[0].label && items[0].value) {
        return items;
      }
      return $.map(items, function (item) {
        if (typeof item === "string") {
          return { label: item, value: item };
        }
        return $.extend({}, item, {
          label: item.label || item.value,
          value: item.value || item.label,
        });
      });
    },
    _suggest: function (items) {
      var ul = this.menu.element.empty();
      this._renderMenu(ul, items);
      this.isNewMenu = true;
      this.menu.refresh();
      ul.show();
      this._resizeMenu();
      ul.position($.extend({ of: this.element }, this.options.position));
      if (this.options.autoFocus) {
        this.menu.next();
      }
    },
    _resizeMenu: function () {
      var ul = this.menu.element;
      ul.outerWidth(
        Math.max(ul.width("").outerWidth() + 1, this.element.outerWidth())
      );
    },
    _renderMenu: function (ul, items) {
      var that = this;
      $.each(items, function (index, item) {
        that._renderItemData(ul, item);
      });
    },
    _renderItemData: function (ul, item) {
      return this._renderItem(ul, item).data("ui-autocomplete-item", item);
    },
    _renderItem: function (ul, item) {
      return $("<li>").append($("<div>").text(item.label)).appendTo(ul);
    },
    _move: function (direction, event) {
      if (!this.menu.element.is(":visible")) {
        this.search(null, event);
        return;
      }
      if (
        (this.menu.isFirstItem() && /^previous/.test(direction)) ||
        (this.menu.isLastItem() && /^next/.test(direction))
      ) {
        if (!this.isMultiLine) {
          this._value(this.term);
        }
        this.menu.blur();
        return;
      }
      this.menu[direction](event);
    },
    widget: function () {
      return this.menu.element;
    },
    _value: function () {
      return this.valueMethod.apply(this.element, arguments);
    },
    _keyEvent: function (keyEvent, event) {
      if (!this.isMultiLine || this.menu.element.is(":visible")) {
        this._move(keyEvent, event);
        event.preventDefault();
      }
    },
  });
  $.extend($.ui.autocomplete, {
    escapeRegex: function (value) {
      return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    },
    filter: function (array, term) {
      var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
      return $.grep(array, function (value) {
        return matcher.test(value.label || value.value || value);
      });
    },
  });
  $.widget("ui.autocomplete", $.ui.autocomplete, {
    options: {
      messages: {
        noResults: "No search results.",
        results: function (amount) {
          return (
            amount +
            (amount > 1 ? " results are" : " result is") +
            " available, use up and down arrow keys to navigate."
          );
        },
      },
    },
    __response: function (content) {
      var message;
      this._superApply(arguments);
      if (this.options.disabled || this.cancelSearch) {
        return;
      }
      if (content && content.length) {
        message = this.options.messages.results(content.length);
      } else {
        message = this.options.messages.noResults;
      }
      this.liveRegion.children().hide();
      $("<div>").text(message).appendTo(this.liveRegion);
    },
  });
  return $.ui.autocomplete;
});

/*!
 * jQuery UI Button @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./core", "./widget"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  var lastActive,
    baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
    typeClasses =
      "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
    formResetHandler = function () {
      var form = $(this);
      setTimeout(function () {
        form.find(":ui-button").button("refresh");
      }, 1);
    },
    radioGroup = function (radio) {
      var name = radio.name,
        form = radio.form,
        radios = $([]);
      if (name) {
        name = name.replace(/'/g, "\\'");
        if (form) {
          radios = $(form).find("[name='" + name + "'][type=radio]");
        } else {
          radios = $(
            "[name='" + name + "'][type=radio]",
            radio.ownerDocument
          ).filter(function () {
            return !this.form;
          });
        }
      }
      return radios;
    };
  $.widget("ui.button", {
    version: "@VERSION",
    defaultElement: "<button>",
    options: {
      disabled: null,
      text: true,
      label: null,
      icons: { primary: null, secondary: null },
    },
    _create: function () {
      this.element
        .closest("form")
        .off("reset" + this.eventNamespace)
        .on("reset" + this.eventNamespace, formResetHandler);
      if (typeof this.options.disabled !== "boolean") {
        this.options.disabled = !!this.element.prop("disabled");
      } else {
        this.element.prop("disabled", this.options.disabled);
      }
      this._determineButtonType();
      this.hasTitle = !!this.buttonElement.attr("title");
      var that = this,
        options = this.options,
        toggleButton = this.type === "checkbox" || this.type === "radio",
        activeClass = !toggleButton ? "ui-state-active" : "";
      if (options.label === null) {
        options.label =
          this.type === "input"
            ? this.buttonElement.val()
            : this.buttonElement.html();
      }
      this._hoverable(this.buttonElement);
      this.buttonElement
        .addClass(baseClasses)
        .attr("role", "button")
        .on("mouseenter" + this.eventNamespace, function () {
          if (options.disabled) {
            return;
          }
          if (this === lastActive) {
            $(this).addClass("ui-state-active");
          }
        })
        .on("mouseleave" + this.eventNamespace, function () {
          if (options.disabled) {
            return;
          }
          $(this).removeClass(activeClass);
        })
        .on("click" + this.eventNamespace, function (event) {
          if (options.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        });
      this._on({
        focus: function () {
          this.buttonElement.addClass("ui-state-focus");
        },
        blur: function () {
          this.buttonElement.removeClass("ui-state-focus");
        },
      });
      if (toggleButton) {
        this.element.on("change" + this.eventNamespace, function () {
          that.refresh();
        });
      }
      if (this.type === "checkbox") {
        this.buttonElement.on("click" + this.eventNamespace, function () {
          if (options.disabled) {
            return false;
          }
        });
      } else if (this.type === "radio") {
        this.buttonElement.on("click" + this.eventNamespace, function () {
          if (options.disabled) {
            return false;
          }
          $(this).addClass("ui-state-active");
          that.buttonElement.attr("aria-pressed", "true");
          var radio = that.element[0];
          radioGroup(radio)
            .not(radio)
            .map(function () {
              return $(this).button("widget")[0];
            })
            .removeClass("ui-state-active")
            .attr("aria-pressed", "false");
        });
      } else {
        this.buttonElement
          .on("mousedown" + this.eventNamespace, function () {
            if (options.disabled) {
              return false;
            }
            $(this).addClass("ui-state-active");
            lastActive = this;
            that.document.one("mouseup", function () {
              lastActive = null;
            });
          })
          .on("mouseup" + this.eventNamespace, function () {
            if (options.disabled) {
              return false;
            }
            $(this).removeClass("ui-state-active");
          })
          .on("keydown" + this.eventNamespace, function (event) {
            if (options.disabled) {
              return false;
            }
            if (
              event.keyCode === $.ui.keyCode.SPACE ||
              event.keyCode === $.ui.keyCode.ENTER
            ) {
              $(this).addClass("ui-state-active");
            }
          })
          .on(
            "keyup" + this.eventNamespace + " blur" + this.eventNamespace,
            function () {
              $(this).removeClass("ui-state-active");
            }
          );
        if (this.buttonElement.is("a")) {
          this.buttonElement.on("keyup", function (event) {
            if (event.keyCode === $.ui.keyCode.SPACE) {
              $(this).trigger("click");
            }
          });
        }
      }
      this._setOption("disabled", options.disabled);
      this._resetButton();
    },
    _determineButtonType: function () {
      var ancestor, labelSelector, checked;
      if (this.element.is("[type=checkbox]")) {
        this.type = "checkbox";
      } else if (this.element.is("[type=radio]")) {
        this.type = "radio";
      } else if (this.element.is("input")) {
        this.type = "input";
      } else {
        this.type = "button";
      }
      if (this.type === "checkbox" || this.type === "radio") {
        ancestor = this.element.parents().last();
        labelSelector = "label[for='" + this.element.attr("id") + "']";
        this.buttonElement = ancestor.find(labelSelector);
        if (!this.buttonElement.length) {
          ancestor = ancestor.length
            ? ancestor.siblings()
            : this.element.siblings();
          this.buttonElement = ancestor.filter(labelSelector);
          if (!this.buttonElement.length) {
            this.buttonElement = ancestor.find(labelSelector);
          }
        }
        this.element.addClass("ui-helper-hidden-accessible");
        checked = this.element.is(":checked");
        if (checked) {
          this.buttonElement.addClass("ui-state-active");
        }
        this.buttonElement.prop("aria-pressed", checked);
      } else {
        this.buttonElement = this.element;
      }
    },
    widget: function () {
      return this.buttonElement;
    },
    _destroy: function () {
      this.element.removeClass("ui-helper-hidden-accessible");
      this.buttonElement
        .removeClass(baseClasses + " ui-state-active " + typeClasses)
        .removeAttr("role aria-pressed")
        .html(this.buttonElement.find(".ui-button-text").html());
      if (!this.hasTitle) {
        this.buttonElement.removeAttr("title");
      }
    },
    _setOption: function (key, value) {
      this._super(key, value);
      if (key === "disabled") {
        this.widget().toggleClass("ui-state-disabled", !!value);
        this.element.prop("disabled", !!value);
        if (value) {
          if (this.type === "checkbox" || this.type === "radio") {
            this.buttonElement.removeClass("ui-state-focus");
          } else {
            this.buttonElement.removeClass("ui-state-focus ui-state-active");
          }
        }
        return;
      }
      this._resetButton();
    },
    refresh: function () {
      var isDisabled = this.element.is("input, button")
        ? this.element.is(":disabled")
        : this.element.hasClass("ui-button-disabled");
      if (isDisabled !== this.options.disabled) {
        this._setOption("disabled", isDisabled);
      }
      if (this.type === "radio") {
        radioGroup(this.element[0]).each(function () {
          if ($(this).is(":checked")) {
            $(this)
              .button("widget")
              .addClass("ui-state-active")
              .attr("aria-pressed", "true");
          } else {
            $(this)
              .button("widget")
              .removeClass("ui-state-active")
              .attr("aria-pressed", "false");
          }
        });
      } else if (this.type === "checkbox") {
        if (this.element.is(":checked")) {
          this.buttonElement
            .addClass("ui-state-active")
            .attr("aria-pressed", "true");
        } else {
          this.buttonElement
            .removeClass("ui-state-active")
            .attr("aria-pressed", "false");
        }
      }
    },
    _resetButton: function () {
      if (this.type === "input") {
        if (this.options.label) {
          this.element.val(this.options.label);
        }
        return;
      }
      var buttonElement = this.buttonElement.removeClass(typeClasses),
        buttonText = $("<span></span>", this.document[0])
          .addClass("ui-button-text")
          .html(this.options.label)
          .appendTo(buttonElement.empty())
          .text(),
        icons = this.options.icons,
        multipleIcons = icons.primary && icons.secondary,
        buttonClasses = [];
      if (icons.primary || icons.secondary) {
        if (this.options.text) {
          buttonClasses.push(
            "ui-button-text-icon" +
              (multipleIcons ? "s" : icons.primary ? "-primary" : "-secondary")
          );
        }
        if (icons.primary) {
          buttonElement.prepend(
            "<span class='ui-button-icon-primary ui-icon " +
              icons.primary +
              "'></span>"
          );
        }
        if (icons.secondary) {
          buttonElement.append(
            "<span class='ui-button-icon-secondary ui-icon " +
              icons.secondary +
              "'></span>"
          );
        }
        if (!this.options.text) {
          buttonClasses.push(
            multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only"
          );
          if (!this.hasTitle) {
            buttonElement.attr("title", $.trim(buttonText));
          }
        }
      } else {
        buttonClasses.push("ui-button-text-only");
      }
      buttonElement.addClass(buttonClasses.join(" "));
    },
  });
  $.widget("ui.buttonset", {
    version: "@VERSION",
    options: {
      items:
        "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)",
    },
    _create: function () {
      this.element.addClass("ui-buttonset");
    },
    _init: function () {
      this.refresh();
    },
    _setOption: function (key, value) {
      if (key === "disabled") {
        this.buttons.button("option", key, value);
      }
      this._super(key, value);
    },
    refresh: function () {
      var rtl = this.element.css("direction") === "rtl",
        allButtons = this.element.find(this.options.items),
        existingButtons = allButtons.filter(":ui-button");
      allButtons.not(":ui-button").button();
      existingButtons.button("refresh");
      this.buttons = allButtons
        .map(function () {
          return $(this).button("widget")[0];
        })
        .removeClass("ui-corner-all ui-corner-left ui-corner-right")
        .filter(":first")
        .addClass(rtl ? "ui-corner-right" : "ui-corner-left")
        .end()
        .filter(":last")
        .addClass(rtl ? "ui-corner-left" : "ui-corner-right")
        .end()
        .end();
    },
    _destroy: function () {
      this.element.removeClass("ui-buttonset");
      this.buttons
        .map(function () {
          return $(this).button("widget")[0];
        })
        .removeClass("ui-corner-left ui-corner-right")
        .end()
        .button("destroy");
    },
  });
  return $.ui.button;
});

/*!
 * jQuery UI Datepicker @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./core"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.extend($.ui, { datepicker: { version: "@VERSION" } });
  var datepicker_instActive;
  function datepicker_getZindex(elem) {
    var position, value;
    while (elem.length && elem[0] !== document) {
      position = elem.css("position");
      if (
        position === "absolute" ||
        position === "relative" ||
        position === "fixed"
      ) {
        value = parseInt(elem.css("zIndex"), 10);
        if (!isNaN(value) && value !== 0) {
          return value;
        }
      }
      elem = elem.parent();
    }
    return 0;
  }
  function Datepicker() {
    this._curInst = null;
    this._keyEvent = false;
    this._disabledInputs = [];
    this._datepickerShowing = false;
    this._inDialog = false;
    this._mainDivId = "ui-datepicker-div";
    this._inlineClass = "ui-datepicker-inline";
    this._appendClass = "ui-datepicker-append";
    this._triggerClass = "ui-datepicker-trigger";
    this._dialogClass = "ui-datepicker-dialog";
    this._disableClass = "ui-datepicker-disabled";
    this._unselectableClass = "ui-datepicker-unselectable";
    this._currentClass = "ui-datepicker-current-day";
    this._dayOverClass = "ui-datepicker-days-cell-over";
    this.regional = [];
    this.regional[""] = {
      closeText: "Done",
      prevText: "Prev",
      nextText: "Next",
      currentText: "Today",
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      weekHeader: "Wk",
      dateFormat: "mm/dd/yy",
      firstDay: 0,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: "",
    };
    this._defaults = {
      showOn: "focus",
      showAnim: "fadeIn",
      showOptions: {},
      defaultDate: null,
      appendText: "",
      buttonText: "...",
      buttonImage: "",
      buttonImageOnly: false,
      hideIfNoPrevNext: false,
      navigationAsDateFormat: false,
      gotoCurrent: false,
      changeMonth: false,
      changeYear: false,
      yearRange: "c-10:c+10",
      showOtherMonths: false,
      selectOtherMonths: false,
      showWeek: false,
      calculateWeek: this.iso8601Week,
      shortYearCutoff: "+10",
      minDate: null,
      maxDate: null,
      duration: "fast",
      beforeShowDay: null,
      beforeShow: null,
      onSelect: null,
      onChangeMonthYear: null,
      onClose: null,
      numberOfMonths: 1,
      showCurrentAtPos: 0,
      stepMonths: 1,
      stepBigMonths: 12,
      altField: "",
      altFormat: "",
      constrainInput: true,
      showButtonPanel: false,
      autoSize: false,
      disabled: false,
    };
    $.extend(this._defaults, this.regional[""]);
    this.regional.en = $.extend(true, {}, this.regional[""]);
    this.regional["en-US"] = $.extend(true, {}, this.regional.en);
    this.dpDiv = datepicker_bindHover(
      $(
        "<div id='" +
          this._mainDivId +
          "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
      )
    );
  }
  $.extend(Datepicker.prototype, {
    markerClassName: "hasDatepicker",
    maxRows: 4,
    _widgetDatepicker: function () {
      return this.dpDiv;
    },
    setDefaults: function (settings) {
      datepicker_extendRemove(this._defaults, settings || {});
      return this;
    },
    _attachDatepicker: function (target, settings) {
      var nodeName, inline, inst;
      nodeName = target.nodeName.toLowerCase();
      inline = nodeName === "div" || nodeName === "span";
      if (!target.id) {
        this.uuid += 1;
        target.id = "dp" + this.uuid;
      }
      inst = this._newInst($(target), inline);
      inst.settings = $.extend({}, settings || {});
      if (nodeName === "input") {
        this._connectDatepicker(target, inst);
      } else if (inline) {
        this._inlineDatepicker(target, inst);
      }
    },
    _newInst: function (target, inline) {
      var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
      return {
        id: id,
        input: target,
        selectedDay: 0,
        selectedMonth: 0,
        selectedYear: 0,
        drawMonth: 0,
        drawYear: 0,
        inline: inline,
        dpDiv: !inline
          ? this.dpDiv
          : datepicker_bindHover(
              $(
                "<div class='" +
                  this._inlineClass +
                  " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
              )
            ),
      };
    },
    _connectDatepicker: function (target, inst) {
      var input = $(target);
      inst.append = $([]);
      inst.trigger = $([]);
      if (input.hasClass(this.markerClassName)) {
        return;
      }
      this._attachments(input, inst);
      input
        .addClass(this.markerClassName)
        .on("keydown", this._doKeyDown)
        .on("keypress", this._doKeyPress)
        .on("keyup", this._doKeyUp);
      this._autoSize(inst);
      $.data(target, "datepicker", inst);
      if (inst.settings.disabled) {
        this._disableDatepicker(target);
      }
    },
    _attachments: function (input, inst) {
      var showOn,
        buttonText,
        buttonImage,
        appendText = this._get(inst, "appendText"),
        isRTL = this._get(inst, "isRTL");
      if (inst.append) {
        inst.append.remove();
      }
      if (appendText) {
        inst.append = $(
          "<span class='" + this._appendClass + "'>" + appendText + "</span>"
        );
        input[isRTL ? "before" : "after"](inst.append);
      }
      input.off("focus", this._showDatepicker);
      if (inst.trigger) {
        inst.trigger.remove();
      }
      showOn = this._get(inst, "showOn");
      if (showOn === "focus" || showOn === "both") {
        input.on("focus", this._showDatepicker);
      }
      if (showOn === "button" || showOn === "both") {
        buttonText = this._get(inst, "buttonText");
        buttonImage = this._get(inst, "buttonImage");
        inst.trigger = $(
          this._get(inst, "buttonImageOnly")
            ? $("<img/>")
                .addClass(this._triggerClass)
                .attr({ src: buttonImage, alt: buttonText, title: buttonText })
            : $("<button type='button'></button>")
                .addClass(this._triggerClass)
                .html(
                  !buttonImage
                    ? buttonText
                    : $("<img/>").attr({
                        src: buttonImage,
                        alt: buttonText,
                        title: buttonText,
                      })
                )
        );
        input[isRTL ? "before" : "after"](inst.trigger);
        inst.trigger.on("click", function () {
          if (
            $.datepicker._datepickerShowing &&
            $.datepicker._lastInput === input[0]
          ) {
            $.datepicker._hideDatepicker();
          } else if (
            $.datepicker._datepickerShowing &&
            $.datepicker._lastInput !== input[0]
          ) {
            $.datepicker._hideDatepicker();
            $.datepicker._showDatepicker(input[0]);
          } else {
            $.datepicker._showDatepicker(input[0]);
          }
          return false;
        });
      }
    },
    _autoSize: function (inst) {
      if (this._get(inst, "autoSize") && !inst.inline) {
        var findMax,
          max,
          maxI,
          i,
          date = new Date(2009, 12 - 1, 20),
          dateFormat = this._get(inst, "dateFormat");
        if (dateFormat.match(/[DM]/)) {
          findMax = function (names) {
            max = 0;
            maxI = 0;
            for (i = 0; i < names.length; i++) {
              if (names[i].length > max) {
                max = names[i].length;
                maxI = i;
              }
            }
            return maxI;
          };
          date.setMonth(
            findMax(
              this._get(
                inst,
                dateFormat.match(/MM/) ? "monthNames" : "monthNamesShort"
              )
            )
          );
          date.setDate(
            findMax(
              this._get(
                inst,
                dateFormat.match(/DD/) ? "dayNames" : "dayNamesShort"
              )
            ) +
              20 -
              date.getDay()
          );
        }
        inst.input.attr("size", this._formatDate(inst, date).length);
      }
    },
    _inlineDatepicker: function (target, inst) {
      var divSpan = $(target);
      if (divSpan.hasClass(this.markerClassName)) {
        return;
      }
      divSpan.addClass(this.markerClassName).append(inst.dpDiv);
      $.data(target, "datepicker", inst);
      this._setDate(inst, this._getDefaultDate(inst), true);
      this._updateDatepicker(inst);
      this._updateAlternate(inst);
      if (inst.settings.disabled) {
        this._disableDatepicker(target);
      }
      inst.dpDiv.css("display", "block");
    },
    _dialogDatepicker: function (input, date, onSelect, settings, pos) {
      var id,
        browserWidth,
        browserHeight,
        scrollX,
        scrollY,
        inst = this._dialogInst;
      if (!inst) {
        this.uuid += 1;
        id = "dp" + this.uuid;
        this._dialogInput = $(
          "<input type='text' id='" +
            id +
            "' style='position: absolute; top: -100px; width: 0px;'/>"
        );
        this._dialogInput.on("keydown", this._doKeyDown);
        $("body").append(this._dialogInput);
        inst = this._dialogInst = this._newInst(this._dialogInput, false);
        inst.settings = {};
        $.data(this._dialogInput[0], "datepicker", inst);
      }
      datepicker_extendRemove(inst.settings, settings || {});
      date =
        date && date.constructor === Date ? this._formatDate(inst, date) : date;
      this._dialogInput.val(date);
      this._pos = pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null;
      if (!this._pos) {
        browserWidth = document.documentElement.clientWidth;
        browserHeight = document.documentElement.clientHeight;
        scrollX =
          document.documentElement.scrollLeft || document.body.scrollLeft;
        scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        this._pos = [
          browserWidth / 2 - 100 + scrollX,
          browserHeight / 2 - 150 + scrollY,
        ];
      }
      this._dialogInput
        .css("left", this._pos[0] + 20 + "px")
        .css("top", this._pos[1] + "px");
      inst.settings.onSelect = onSelect;
      this._inDialog = true;
      this.dpDiv.addClass(this._dialogClass);
      this._showDatepicker(this._dialogInput[0]);
      if ($.blockUI) {
        $.blockUI(this.dpDiv);
      }
      $.data(this._dialogInput[0], "datepicker", inst);
      return this;
    },
    _destroyDatepicker: function (target) {
      var nodeName,
        $target = $(target),
        inst = $.data(target, "datepicker");
      if (!$target.hasClass(this.markerClassName)) {
        return;
      }
      nodeName = target.nodeName.toLowerCase();
      $.removeData(target, "datepicker");
      if (nodeName === "input") {
        inst.append.remove();
        inst.trigger.remove();
        $target
          .removeClass(this.markerClassName)
          .off("focus", this._showDatepicker)
          .off("keydown", this._doKeyDown)
          .off("keypress", this._doKeyPress)
          .off("keyup", this._doKeyUp);
      } else if (nodeName === "div" || nodeName === "span") {
        $target.removeClass(this.markerClassName).empty();
      }
      if (datepicker_instActive === inst) {
        datepicker_instActive = null;
      }
    },
    _enableDatepicker: function (target) {
      var nodeName,
        inline,
        $target = $(target),
        inst = $.data(target, "datepicker");
      if (!$target.hasClass(this.markerClassName)) {
        return;
      }
      nodeName = target.nodeName.toLowerCase();
      if (nodeName === "input") {
        target.disabled = false;
        inst.trigger
          .filter("button")
          .each(function () {
            this.disabled = false;
          })
          .end()
          .filter("img")
          .css({ opacity: "1.0", cursor: "" });
      } else if (nodeName === "div" || nodeName === "span") {
        inline = $target.children("." + this._inlineClass);
        inline.children().removeClass("ui-state-disabled");
        inline
          .find("select.ui-datepicker-month, select.ui-datepicker-year")
          .prop("disabled", false);
      }
      this._disabledInputs = $.map(this._disabledInputs, function (value) {
        return value === target ? null : value;
      });
    },
    _disableDatepicker: function (target) {
      var nodeName,
        inline,
        $target = $(target),
        inst = $.data(target, "datepicker");
      if (!$target.hasClass(this.markerClassName)) {
        return;
      }
      nodeName = target.nodeName.toLowerCase();
      if (nodeName === "input") {
        target.disabled = true;
        inst.trigger
          .filter("button")
          .each(function () {
            this.disabled = true;
          })
          .end()
          .filter("img")
          .css({ opacity: "0.5", cursor: "default" });
      } else if (nodeName === "div" || nodeName === "span") {
        inline = $target.children("." + this._inlineClass);
        inline.children().addClass("ui-state-disabled");
        inline
          .find("select.ui-datepicker-month, select.ui-datepicker-year")
          .prop("disabled", true);
      }
      this._disabledInputs = $.map(this._disabledInputs, function (value) {
        return value === target ? null : value;
      });
      this._disabledInputs[this._disabledInputs.length] = target;
    },
    _isDisabledDatepicker: function (target) {
      if (!target) {
        return false;
      }
      for (var i = 0; i < this._disabledInputs.length; i++) {
        if (this._disabledInputs[i] === target) {
          return true;
        }
      }
      return false;
    },
    _getInst: function (target) {
      try {
        return $.data(target, "datepicker");
      } catch (err) {
        throw "Missing instance data for this datepicker";
      }
    },
    _optionDatepicker: function (target, name, value) {
      var settings,
        date,
        minDate,
        maxDate,
        inst = this._getInst(target);
      if (arguments.length === 2 && typeof name === "string") {
        return name === "defaults"
          ? $.extend({}, $.datepicker._defaults)
          : inst
          ? name === "all"
            ? $.extend({}, inst.settings)
            : this._get(inst, name)
          : null;
      }
      settings = name || {};
      if (typeof name === "string") {
        settings = {};
        settings[name] = value;
      }
      if (inst) {
        if (this._curInst === inst) {
          this._hideDatepicker();
        }
        date = this._getDateDatepicker(target, true);
        minDate = this._getMinMaxDate(inst, "min");
        maxDate = this._getMinMaxDate(inst, "max");
        datepicker_extendRemove(inst.settings, settings);
        if (
          minDate !== null &&
          settings.dateFormat !== undefined &&
          settings.minDate === undefined
        ) {
          inst.settings.minDate = this._formatDate(inst, minDate);
        }
        if (
          maxDate !== null &&
          settings.dateFormat !== undefined &&
          settings.maxDate === undefined
        ) {
          inst.settings.maxDate = this._formatDate(inst, maxDate);
        }
        if ("disabled" in settings) {
          if (settings.disabled) {
            this._disableDatepicker(target);
          } else {
            this._enableDatepicker(target);
          }
        }
        this._attachments($(target), inst);
        this._autoSize(inst);
        this._setDate(inst, date);
        this._updateAlternate(inst);
        this._updateDatepicker(inst);
      }
    },
    _changeDatepicker: function (target, name, value) {
      this._optionDatepicker(target, name, value);
    },
    _refreshDatepicker: function (target) {
      var inst = this._getInst(target);
      if (inst) {
        this._updateDatepicker(inst);
      }
    },
    _setDateDatepicker: function (target, date) {
      var inst = this._getInst(target);
      if (inst) {
        this._setDate(inst, date);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
      }
    },
    _getDateDatepicker: function (target, noDefault) {
      var inst = this._getInst(target);
      if (inst && !inst.inline) {
        this._setDateFromField(inst, noDefault);
      }
      return inst ? this._getDate(inst) : null;
    },
    _doKeyDown: function (event) {
      var onSelect,
        dateStr,
        sel,
        inst = $.datepicker._getInst(event.target),
        handled = true,
        isRTL = inst.dpDiv.is(".ui-datepicker-rtl");
      inst._keyEvent = true;
      if ($.datepicker._datepickerShowing) {
        switch (event.keyCode) {
          case 9:
            $.datepicker._hideDatepicker();
            handled = false;
            break;
          case 13:
            sel = $(
              "td." +
                $.datepicker._dayOverClass +
                ":not(." +
                $.datepicker._currentClass +
                ")",
              inst.dpDiv
            );
            if (sel[0]) {
              $.datepicker._selectDay(
                event.target,
                inst.selectedMonth,
                inst.selectedYear,
                sel[0]
              );
            }
            onSelect = $.datepicker._get(inst, "onSelect");
            if (onSelect) {
              dateStr = $.datepicker._formatDate(inst);
              onSelect.apply(inst.input ? inst.input[0] : null, [
                dateStr,
                inst,
              ]);
            } else {
              $.datepicker._hideDatepicker();
            }
            return false;
          case 27:
            $.datepicker._hideDatepicker();
            break;
          case 33:
            $.datepicker._adjustDate(
              event.target,
              event.ctrlKey
                ? -$.datepicker._get(inst, "stepBigMonths")
                : -$.datepicker._get(inst, "stepMonths"),
              "M"
            );
            break;
          case 34:
            $.datepicker._adjustDate(
              event.target,
              event.ctrlKey
                ? +$.datepicker._get(inst, "stepBigMonths")
                : +$.datepicker._get(inst, "stepMonths"),
              "M"
            );
            break;
          case 35:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._clearDate(event.target);
            }
            handled = event.ctrlKey || event.metaKey;
            break;
          case 36:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._gotoToday(event.target);
            }
            handled = event.ctrlKey || event.metaKey;
            break;
          case 37:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, isRTL ? +1 : -1, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            if (event.originalEvent.altKey) {
              $.datepicker._adjustDate(
                event.target,
                event.ctrlKey
                  ? -$.datepicker._get(inst, "stepBigMonths")
                  : -$.datepicker._get(inst, "stepMonths"),
                "M"
              );
            }
            break;
          case 38:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, -7, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            break;
          case 39:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, isRTL ? -1 : +1, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            if (event.originalEvent.altKey) {
              $.datepicker._adjustDate(
                event.target,
                event.ctrlKey
                  ? +$.datepicker._get(inst, "stepBigMonths")
                  : +$.datepicker._get(inst, "stepMonths"),
                "M"
              );
            }
            break;
          case 40:
            if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, +7, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            break;
          default:
            handled = false;
        }
      } else if (event.keyCode === 36 && event.ctrlKey) {
        $.datepicker._showDatepicker(this);
      } else {
        handled = false;
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    _doKeyPress: function (event) {
      var chars,
        chr,
        inst = $.datepicker._getInst(event.target);
      if ($.datepicker._get(inst, "constrainInput")) {
        chars = $.datepicker._possibleChars(
          $.datepicker._get(inst, "dateFormat")
        );
        chr = String.fromCharCode(
          event.charCode == null ? event.keyCode : event.charCode
        );
        return (
          event.ctrlKey ||
          event.metaKey ||
          chr < " " ||
          !chars ||
          chars.indexOf(chr) > -1
        );
      }
    },
    _doKeyUp: function (event) {
      var date,
        inst = $.datepicker._getInst(event.target);
      if (inst.input.val() !== inst.lastVal) {
        try {
          date = $.datepicker.parseDate(
            $.datepicker._get(inst, "dateFormat"),
            inst.input ? inst.input.val() : null,
            $.datepicker._getFormatConfig(inst)
          );
          if (date) {
            $.datepicker._setDateFromField(inst);
            $.datepicker._updateAlternate(inst);
            $.datepicker._updateDatepicker(inst);
          }
        } catch (err) {}
      }
      return true;
    },
    _showDatepicker: function (input) {
      input = input.target || input;
      if (input.nodeName.toLowerCase() !== "input") {
        input = $("input", input.parentNode)[0];
      }
      if (
        $.datepicker._isDisabledDatepicker(input) ||
        $.datepicker._lastInput === input
      ) {
        return;
      }
      var inst,
        beforeShow,
        beforeShowSettings,
        isFixed,
        offset,
        showAnim,
        duration;
      inst = $.datepicker._getInst(input);
      if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
        $.datepicker._curInst.dpDiv.stop(true, true);
        if (inst && $.datepicker._datepickerShowing) {
          $.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
        }
      }
      beforeShow = $.datepicker._get(inst, "beforeShow");
      beforeShowSettings = beforeShow
        ? beforeShow.apply(input, [input, inst])
        : {};
      if (beforeShowSettings === false) {
        return;
      }
      datepicker_extendRemove(inst.settings, beforeShowSettings);
      inst.lastVal = null;
      $.datepicker._lastInput = input;
      $.datepicker._setDateFromField(inst);
      if ($.datepicker._inDialog) {
        input.value = "";
      }
      if (!$.datepicker._pos) {
        $.datepicker._pos = $.datepicker._findPos(input);
        $.datepicker._pos[1] += input.offsetHeight;
      }
      isFixed = false;
      $(input)
        .parents()
        .each(function () {
          isFixed |= $(this).css("position") === "fixed";
          return !isFixed;
        });
      offset = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] };
      $.datepicker._pos = null;
      inst.dpDiv.empty();
      inst.dpDiv.css({
        position: "absolute",
        display: "block",
        top: "-1000px",
      });
      $.datepicker._updateDatepicker(inst);
      offset = $.datepicker._checkOffset(inst, offset, isFixed);
      inst.dpDiv.css({
        position:
          $.datepicker._inDialog && $.blockUI
            ? "static"
            : isFixed
            ? "fixed"
            : "absolute",
        display: "none",
        left: offset.left + "px",
        top: offset.top + "px",
      });
      if (!inst.inline) {
        showAnim = $.datepicker._get(inst, "showAnim");
        duration = $.datepicker._get(inst, "duration");
        inst.dpDiv.css("z-index", datepicker_getZindex($(input)) + 1);
        $.datepicker._datepickerShowing = true;
        if ($.effects && $.effects.effect[showAnim]) {
          inst.dpDiv.show(
            showAnim,
            $.datepicker._get(inst, "showOptions"),
            duration
          );
        } else {
          inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
        }
        if ($.datepicker._shouldFocusInput(inst)) {
          inst.input.trigger("focus");
        }
        $.datepicker._curInst = inst;
      }
    },
    _updateDatepicker: function (inst) {
      this.maxRows = 4;
      datepicker_instActive = inst;
      inst.dpDiv.empty().append(this._generateHTML(inst));
      this._attachHandlers(inst);
      var origyearshtml,
        numMonths = this._getNumberOfMonths(inst),
        cols = numMonths[1],
        width = 17,
        activeCell = inst.dpDiv.find("." + this._dayOverClass + " a");
      if (activeCell.length > 0) {
        datepicker_handleMouseover.apply(activeCell.get(0));
      }
      inst.dpDiv
        .removeClass(
          "ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4"
        )
        .width("");
      if (cols > 1) {
        inst.dpDiv
          .addClass("ui-datepicker-multi-" + cols)
          .css("width", width * cols + "em");
      }
      inst.dpDiv[
        (numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") + "Class"
      ]("ui-datepicker-multi");
      inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") + "Class"](
        "ui-datepicker-rtl"
      );
      if (
        inst === $.datepicker._curInst &&
        $.datepicker._datepickerShowing &&
        $.datepicker._shouldFocusInput(inst)
      ) {
        inst.input.trigger("focus");
      }
      if (inst.yearshtml) {
        origyearshtml = inst.yearshtml;
        setTimeout(function () {
          if (origyearshtml === inst.yearshtml && inst.yearshtml) {
            inst.dpDiv
              .find("select.ui-datepicker-year:first")
              .replaceWith(inst.yearshtml);
          }
          origyearshtml = inst.yearshtml = null;
        }, 0);
      }
    },
    _shouldFocusInput: function (inst) {
      return (
        inst.input &&
        inst.input.is(":visible") &&
        !inst.input.is(":disabled") &&
        !inst.input.is(":focus")
      );
    },
    _checkOffset: function (inst, offset, isFixed) {
      var dpWidth = inst.dpDiv.outerWidth(),
        dpHeight = inst.dpDiv.outerHeight(),
        inputWidth = inst.input ? inst.input.outerWidth() : 0,
        inputHeight = inst.input ? inst.input.outerHeight() : 0,
        viewWidth =
          document.documentElement.clientWidth +
          (isFixed ? 0 : $(document).scrollLeft()),
        viewHeight =
          document.documentElement.clientHeight +
          (isFixed ? 0 : $(document).scrollTop());
      offset.left -= this._get(inst, "isRTL") ? dpWidth - inputWidth : 0;
      offset.left -=
        isFixed && offset.left === inst.input.offset().left
          ? $(document).scrollLeft()
          : 0;
      offset.top -=
        isFixed && offset.top === inst.input.offset().top + inputHeight
          ? $(document).scrollTop()
          : 0;
      offset.left -= Math.min(
        offset.left,
        offset.left + dpWidth > viewWidth && viewWidth > dpWidth
          ? Math.abs(offset.left + dpWidth - viewWidth)
          : 0
      );
      offset.top -= Math.min(
        offset.top,
        offset.top + dpHeight > viewHeight && viewHeight > dpHeight
          ? Math.abs(dpHeight + inputHeight)
          : 0
      );
      return offset;
    },
    _findPos: function (obj) {
      var position,
        inst = this._getInst(obj),
        isRTL = this._get(inst, "isRTL");
      while (
        obj &&
        (obj.type === "hidden" ||
          obj.nodeType !== 1 ||
          $.expr.filters.hidden(obj))
      ) {
        obj = obj[isRTL ? "previousSibling" : "nextSibling"];
      }
      position = $(obj).offset();
      return [position.left, position.top];
    },
    _hideDatepicker: function (input) {
      var showAnim,
        duration,
        postProcess,
        onClose,
        inst = this._curInst;
      if (!inst || (input && inst !== $.data(input, "datepicker"))) {
        return;
      }
      if (this._datepickerShowing) {
        showAnim = this._get(inst, "showAnim");
        duration = this._get(inst, "duration");
        postProcess = function () {
          $.datepicker._tidyDialog(inst);
        };
        if ($.effects && ($.effects.effect[showAnim] || $.effects[showAnim])) {
          inst.dpDiv.hide(
            showAnim,
            $.datepicker._get(inst, "showOptions"),
            duration,
            postProcess
          );
        } else {
          inst.dpDiv[
            showAnim === "slideDown"
              ? "slideUp"
              : showAnim === "fadeIn"
              ? "fadeOut"
              : "hide"
          ](showAnim ? duration : null, postProcess);
        }
        if (!showAnim) {
          postProcess();
        }
        this._datepickerShowing = false;
        onClose = this._get(inst, "onClose");
        if (onClose) {
          onClose.apply(inst.input ? inst.input[0] : null, [
            inst.input ? inst.input.val() : "",
            inst,
          ]);
        }
        this._lastInput = null;
        if (this._inDialog) {
          this._dialogInput.css({
            position: "absolute",
            left: "0",
            top: "-100px",
          });
          if ($.blockUI) {
            $.unblockUI();
            $("body").append(this.dpDiv);
          }
        }
        this._inDialog = false;
      }
    },
    _tidyDialog: function (inst) {
      inst.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar");
    },
    _checkExternalClick: function (event) {
      if (!$.datepicker._curInst) {
        return;
      }
      var $target = $(event.target),
        inst = $.datepicker._getInst($target[0]);
      if (
        ($target[0].id !== $.datepicker._mainDivId &&
          $target.parents("#" + $.datepicker._mainDivId).length === 0 &&
          !$target.hasClass($.datepicker.markerClassName) &&
          !$target.closest("." + $.datepicker._triggerClass).length &&
          $.datepicker._datepickerShowing &&
          !($.datepicker._inDialog && $.blockUI)) ||
        ($target.hasClass($.datepicker.markerClassName) &&
          $.datepicker._curInst !== inst)
      ) {
        $.datepicker._hideDatepicker();
      }
    },
    _adjustDate: function (id, offset, period) {
      var target = $(id),
        inst = this._getInst(target[0]);
      if (this._isDisabledDatepicker(target[0])) {
        return;
      }
      this._adjustInstDate(
        inst,
        offset + (period === "M" ? this._get(inst, "showCurrentAtPos") : 0),
        period
      );
      this._updateDatepicker(inst);
    },
    _gotoToday: function (id) {
      var date,
        target = $(id),
        inst = this._getInst(target[0]);
      if (this._get(inst, "gotoCurrent") && inst.currentDay) {
        inst.selectedDay = inst.currentDay;
        inst.drawMonth = inst.selectedMonth = inst.currentMonth;
        inst.drawYear = inst.selectedYear = inst.currentYear;
      } else {
        date = new Date();
        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
      }
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    _selectMonthYear: function (id, select, period) {
      var target = $(id),
        inst = this._getInst(target[0]);
      inst["selected" + (period === "M" ? "Month" : "Year")] = inst[
        "draw" + (period === "M" ? "Month" : "Year")
      ] = parseInt(select.options[select.selectedIndex].value, 10);
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    _selectDay: function (id, month, year, td) {
      var inst,
        target = $(id);
      if (
        $(td).hasClass(this._unselectableClass) ||
        this._isDisabledDatepicker(target[0])
      ) {
        return;
      }
      inst = this._getInst(target[0]);
      inst.selectedDay = inst.currentDay = $("a", td).html();
      inst.selectedMonth = inst.currentMonth = month;
      inst.selectedYear = inst.currentYear = year;
      this._selectDate(
        id,
        this._formatDate(
          inst,
          inst.currentDay,
          inst.currentMonth,
          inst.currentYear
        )
      );
    },
    _clearDate: function (id) {
      var target = $(id);
      this._selectDate(target, "");
    },
    _selectDate: function (id, dateStr) {
      var onSelect,
        target = $(id),
        inst = this._getInst(target[0]);
      dateStr = dateStr != null ? dateStr : this._formatDate(inst);
      if (inst.input) {
        inst.input.val(dateStr);
      }
      this._updateAlternate(inst);
      onSelect = this._get(inst, "onSelect");
      if (onSelect) {
        onSelect.apply(inst.input ? inst.input[0] : null, [dateStr, inst]);
      } else if (inst.input) {
        inst.input.trigger("change");
      }
      if (inst.inline) {
        this._updateDatepicker(inst);
      } else {
        this._hideDatepicker();
        this._lastInput = inst.input[0];
        if (typeof inst.input[0] !== "object") {
          inst.input.trigger("focus");
        }
        this._lastInput = null;
      }
    },
    _updateAlternate: function (inst) {
      var altFormat,
        date,
        dateStr,
        altField = this._get(inst, "altField");
      if (altField) {
        altFormat =
          this._get(inst, "altFormat") || this._get(inst, "dateFormat");
        date = this._getDate(inst);
        dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
        $(altField).each(function () {
          $(this).val(dateStr);
        });
      }
    },
    noWeekends: function (date) {
      var day = date.getDay();
      return [day > 0 && day < 6, ""];
    },
    iso8601Week: function (date) {
      var time,
        checkDate = new Date(date.getTime());
      checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
      time = checkDate.getTime();
      checkDate.setMonth(0);
      checkDate.setDate(1);
      return Math.floor(Math.round((time - checkDate) / 864e5) / 7) + 1;
    },
    parseDate: function (format, value, settings) {
      if (format == null || value == null) {
        throw "Invalid arguments";
      }
      value = typeof value === "object" ? value.toString() : value + "";
      if (value === "") {
        return null;
      }
      var iFormat,
        dim,
        extra,
        iValue = 0,
        shortYearCutoffTemp =
          (settings ? settings.shortYearCutoff : null) ||
          this._defaults.shortYearCutoff,
        shortYearCutoff =
          typeof shortYearCutoffTemp !== "string"
            ? shortYearCutoffTemp
            : (new Date().getFullYear() % 100) +
              parseInt(shortYearCutoffTemp, 10),
        dayNamesShort =
          (settings ? settings.dayNamesShort : null) ||
          this._defaults.dayNamesShort,
        dayNames =
          (settings ? settings.dayNames : null) || this._defaults.dayNames,
        monthNamesShort =
          (settings ? settings.monthNamesShort : null) ||
          this._defaults.monthNamesShort,
        monthNames =
          (settings ? settings.monthNames : null) || this._defaults.monthNames,
        year = -1,
        month = -1,
        day = -1,
        doy = -1,
        literal = false,
        date,
        lookAhead = function (match) {
          var matches =
            iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
          if (matches) {
            iFormat++;
          }
          return matches;
        },
        getNumber = function (match) {
          var isDoubled = lookAhead(match),
            size =
              match === "@"
                ? 14
                : match === "!"
                ? 20
                : match === "y" && isDoubled
                ? 4
                : match === "o"
                ? 3
                : 2,
            minSize = match === "y" ? size : 1,
            digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
            num = value.substring(iValue).match(digits);
          if (!num) {
            throw "Missing number at position " + iValue;
          }
          iValue += num[0].length;
          return parseInt(num[0], 10);
        },
        getName = function (match, shortNames, longNames) {
          var index = -1,
            names = $.map(
              lookAhead(match) ? longNames : shortNames,
              function (v, k) {
                return [[k, v]];
              }
            ).sort(function (a, b) {
              return -(a[1].length - b[1].length);
            });
          $.each(names, function (i, pair) {
            var name = pair[1];
            if (
              value.substr(iValue, name.length).toLowerCase() ===
              name.toLowerCase()
            ) {
              index = pair[0];
              iValue += name.length;
              return false;
            }
          });
          if (index !== -1) {
            return index + 1;
          } else {
            throw "Unknown name at position " + iValue;
          }
        },
        checkLiteral = function () {
          if (value.charAt(iValue) !== format.charAt(iFormat)) {
            throw "Unexpected literal at position " + iValue;
          }
          iValue++;
        };
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            checkLiteral();
          }
        } else {
          switch (format.charAt(iFormat)) {
            case "d":
              day = getNumber("d");
              break;
            case "D":
              getName("D", dayNamesShort, dayNames);
              break;
            case "o":
              doy = getNumber("o");
              break;
            case "m":
              month = getNumber("m");
              break;
            case "M":
              month = getName("M", monthNamesShort, monthNames);
              break;
            case "y":
              year = getNumber("y");
              break;
            case "@":
              date = new Date(getNumber("@"));
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "!":
              date = new Date((getNumber("!") - this._ticksTo1970) / 1e4);
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "'":
              if (lookAhead("'")) {
                checkLiteral();
              } else {
                literal = true;
              }
              break;
            default:
              checkLiteral();
          }
        }
      }
      if (iValue < value.length) {
        extra = value.substr(iValue);
        if (!/^\s+/.test(extra)) {
          throw "Extra/unparsed characters found in date: " + extra;
        }
      }
      if (year === -1) {
        year = new Date().getFullYear();
      } else if (year < 100) {
        year +=
          new Date().getFullYear() -
          (new Date().getFullYear() % 100) +
          (year <= shortYearCutoff ? 0 : -100);
      }
      if (doy > -1) {
        month = 1;
        day = doy;
        do {
          dim = this._getDaysInMonth(year, month - 1);
          if (day <= dim) {
            break;
          }
          month++;
          day -= dim;
        } while (true);
      }
      date = this._daylightSavingAdjust(new Date(year, month - 1, day));
      if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
      ) {
        throw "Invalid date";
      }
      return date;
    },
    ATOM: "yy-mm-dd",
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y",
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd",
    _ticksTo1970:
      ((1970 - 1) * 365 +
        Math.floor(1970 / 4) -
        Math.floor(1970 / 100) +
        Math.floor(1970 / 400)) *
      24 *
      60 *
      60 *
      1e7,
    formatDate: function (format, date, settings) {
      if (!date) {
        return "";
      }
      var iFormat,
        dayNamesShort =
          (settings ? settings.dayNamesShort : null) ||
          this._defaults.dayNamesShort,
        dayNames =
          (settings ? settings.dayNames : null) || this._defaults.dayNames,
        monthNamesShort =
          (settings ? settings.monthNamesShort : null) ||
          this._defaults.monthNamesShort,
        monthNames =
          (settings ? settings.monthNames : null) || this._defaults.monthNames,
        lookAhead = function (match) {
          var matches =
            iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
          if (matches) {
            iFormat++;
          }
          return matches;
        },
        formatNumber = function (match, value, len) {
          var num = "" + value;
          if (lookAhead(match)) {
            while (num.length < len) {
              num = "0" + num;
            }
          }
          return num;
        },
        formatName = function (match, value, shortNames, longNames) {
          return lookAhead(match) ? longNames[value] : shortNames[value];
        },
        output = "",
        literal = false;
      if (date) {
        for (iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
            if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
              literal = false;
            } else {
              output += format.charAt(iFormat);
            }
          } else {
            switch (format.charAt(iFormat)) {
              case "d":
                output += formatNumber("d", date.getDate(), 2);
                break;
              case "D":
                output += formatName(
                  "D",
                  date.getDay(),
                  dayNamesShort,
                  dayNames
                );
                break;
              case "o":
                output += formatNumber(
                  "o",
                  Math.round(
                    (new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    ).getTime() -
                      new Date(date.getFullYear(), 0, 0).getTime()) /
                      864e5
                  ),
                  3
                );
                break;
              case "m":
                output += formatNumber("m", date.getMonth() + 1, 2);
                break;
              case "M":
                output += formatName(
                  "M",
                  date.getMonth(),
                  monthNamesShort,
                  monthNames
                );
                break;
              case "y":
                output += lookAhead("y")
                  ? date.getFullYear()
                  : (date.getYear() % 100 < 10 ? "0" : "") +
                    (date.getYear() % 100);
                break;
              case "@":
                output += date.getTime();
                break;
              case "!":
                output += date.getTime() * 1e4 + this._ticksTo1970;
                break;
              case "'":
                if (lookAhead("'")) {
                  output += "'";
                } else {
                  literal = true;
                }
                break;
              default:
                output += format.charAt(iFormat);
            }
          }
        }
      }
      return output;
    },
    _possibleChars: function (format) {
      var iFormat,
        chars = "",
        literal = false,
        lookAhead = function (match) {
          var matches =
            iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
          if (matches) {
            iFormat++;
          }
          return matches;
        };
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            chars += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
            case "d":
            case "m":
            case "y":
            case "@":
              chars += "0123456789";
              break;
            case "D":
            case "M":
              return null;
            case "'":
              if (lookAhead("'")) {
                chars += "'";
              } else {
                literal = true;
              }
              break;
            default:
              chars += format.charAt(iFormat);
          }
        }
      }
      return chars;
    },
    _get: function (inst, name) {
      return inst.settings[name] !== undefined
        ? inst.settings[name]
        : this._defaults[name];
    },
    _setDateFromField: function (inst, noDefault) {
      if (inst.input.val() === inst.lastVal) {
        return;
      }
      var dateFormat = this._get(inst, "dateFormat"),
        dates = (inst.lastVal = inst.input ? inst.input.val() : null),
        defaultDate = this._getDefaultDate(inst),
        date = defaultDate,
        settings = this._getFormatConfig(inst);
      try {
        date = this.parseDate(dateFormat, dates, settings) || defaultDate;
      } catch (event) {
        dates = noDefault ? "" : dates;
      }
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
      inst.currentDay = dates ? date.getDate() : 0;
      inst.currentMonth = dates ? date.getMonth() : 0;
      inst.currentYear = dates ? date.getFullYear() : 0;
      this._adjustInstDate(inst);
    },
    _getDefaultDate: function (inst) {
      return this._restrictMinMax(
        inst,
        this._determineDate(inst, this._get(inst, "defaultDate"), new Date())
      );
    },
    _determineDate: function (inst, date, defaultDate) {
      var offsetNumeric = function (offset) {
          var date = new Date();
          date.setDate(date.getDate() + offset);
          return date;
        },
        offsetString = function (offset) {
          try {
            return $.datepicker.parseDate(
              $.datepicker._get(inst, "dateFormat"),
              offset,
              $.datepicker._getFormatConfig(inst)
            );
          } catch (e) {}
          var date =
              (offset.toLowerCase().match(/^c/)
                ? $.datepicker._getDate(inst)
                : null) || new Date(),
            year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
            matches = pattern.exec(offset);
          while (matches) {
            switch (matches[2] || "d") {
              case "d":
              case "D":
                day += parseInt(matches[1], 10);
                break;
              case "w":
              case "W":
                day += parseInt(matches[1], 10) * 7;
                break;
              case "m":
              case "M":
                month += parseInt(matches[1], 10);
                day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                break;
              case "y":
              case "Y":
                year += parseInt(matches[1], 10);
                day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                break;
            }
            matches = pattern.exec(offset);
          }
          return new Date(year, month, day);
        },
        newDate =
          date == null || date === ""
            ? defaultDate
            : typeof date === "string"
            ? offsetString(date)
            : typeof date === "number"
            ? isNaN(date)
              ? defaultDate
              : offsetNumeric(date)
            : new Date(date.getTime());
      newDate =
        newDate && newDate.toString() === "Invalid Date"
          ? defaultDate
          : newDate;
      if (newDate) {
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
      }
      return this._daylightSavingAdjust(newDate);
    },
    _daylightSavingAdjust: function (date) {
      if (!date) {
        return null;
      }
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    },
    _setDate: function (inst, date, noChange) {
      var clear = !date,
        origMonth = inst.selectedMonth,
        origYear = inst.selectedYear,
        newDate = this._restrictMinMax(
          inst,
          this._determineDate(inst, date, new Date())
        );
      inst.selectedDay = inst.currentDay = newDate.getDate();
      inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
      inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
      if (
        (origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) &&
        !noChange
      ) {
        this._notifyChange(inst);
      }
      this._adjustInstDate(inst);
      if (inst.input) {
        inst.input.val(clear ? "" : this._formatDate(inst));
      }
    },
    _getDate: function (inst) {
      var startDate =
        !inst.currentYear || (inst.input && inst.input.val() === "")
          ? null
          : this._daylightSavingAdjust(
              new Date(inst.currentYear, inst.currentMonth, inst.currentDay)
            );
      return startDate;
    },
    _attachHandlers: function (inst) {
      var stepMonths = this._get(inst, "stepMonths"),
        id = "#" + inst.id.replace(/\\\\/g, "\\");
      inst.dpDiv.find("[data-handler]").map(function () {
        var handler = {
          prev: function () {
            $.datepicker._adjustDate(id, -stepMonths, "M");
          },
          next: function () {
            $.datepicker._adjustDate(id, +stepMonths, "M");
          },
          hide: function () {
            $.datepicker._hideDatepicker();
          },
          today: function () {
            $.datepicker._gotoToday(id);
          },
          selectDay: function () {
            $.datepicker._selectDay(
              id,
              +this.getAttribute("data-month"),
              +this.getAttribute("data-year"),
              this
            );
            return false;
          },
          selectMonth: function () {
            $.datepicker._selectMonthYear(id, this, "M");
            return false;
          },
          selectYear: function () {
            $.datepicker._selectMonthYear(id, this, "Y");
            return false;
          },
        };
        $(this).on(
          this.getAttribute("data-event"),
          handler[this.getAttribute("data-handler")]
        );
      });
    },
    _generateHTML: function (inst) {
      var maxDraw,
        prevText,
        prev,
        nextText,
        next,
        currentText,
        gotoDate,
        controls,
        buttonPanel,
        firstDay,
        showWeek,
        dayNames,
        dayNamesMin,
        monthNames,
        monthNamesShort,
        beforeShowDay,
        showOtherMonths,
        selectOtherMonths,
        defaultDate,
        html,
        dow,
        row,
        group,
        col,
        selectedDate,
        cornerClass,
        calender,
        thead,
        day,
        daysInMonth,
        leadDays,
        curRows,
        numRows,
        printDate,
        dRow,
        tbody,
        daySettings,
        otherMonth,
        unselectable,
        tempDate = new Date(),
        today = this._daylightSavingAdjust(
          new Date(
            tempDate.getFullYear(),
            tempDate.getMonth(),
            tempDate.getDate()
          )
        ),
        isRTL = this._get(inst, "isRTL"),
        showButtonPanel = this._get(inst, "showButtonPanel"),
        hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
        navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
        numMonths = this._getNumberOfMonths(inst),
        showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
        stepMonths = this._get(inst, "stepMonths"),
        isMultiMonth = numMonths[0] !== 1 || numMonths[1] !== 1,
        currentDate = this._daylightSavingAdjust(
          !inst.currentDay
            ? new Date(9999, 9, 9)
            : new Date(inst.currentYear, inst.currentMonth, inst.currentDay)
        ),
        minDate = this._getMinMaxDate(inst, "min"),
        maxDate = this._getMinMaxDate(inst, "max"),
        drawMonth = inst.drawMonth - showCurrentAtPos,
        drawYear = inst.drawYear;
      if (drawMonth < 0) {
        drawMonth += 12;
        drawYear--;
      }
      if (maxDate) {
        maxDraw = this._daylightSavingAdjust(
          new Date(
            maxDate.getFullYear(),
            maxDate.getMonth() - numMonths[0] * numMonths[1] + 1,
            maxDate.getDate()
          )
        );
        maxDraw = minDate && maxDraw < minDate ? minDate : maxDraw;
        while (
          this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw
        ) {
          drawMonth--;
          if (drawMonth < 0) {
            drawMonth = 11;
            drawYear--;
          }
        }
      }
      inst.drawMonth = drawMonth;
      inst.drawYear = drawYear;
      prevText = this._get(inst, "prevText");
      prevText = !navigationAsDateFormat
        ? prevText
        : this.formatDate(
            prevText,
            this._daylightSavingAdjust(
              new Date(drawYear, drawMonth - stepMonths, 1)
            ),
            this._getFormatConfig(inst)
          );
      prev = this._canAdjustMonth(inst, -1, drawYear, drawMonth)
        ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
          " title='" +
          prevText +
          "'><span class='ui-icon ui-icon-circle-triangle-" +
          (isRTL ? "e" : "w") +
          "'>" +
          prevText +
          "</span></a>"
        : hideIfNoPrevNext
        ? ""
        : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" +
          prevText +
          "'><span class='ui-icon ui-icon-circle-triangle-" +
          (isRTL ? "e" : "w") +
          "'>" +
          prevText +
          "</span></a>";
      nextText = this._get(inst, "nextText");
      nextText = !navigationAsDateFormat
        ? nextText
        : this.formatDate(
            nextText,
            this._daylightSavingAdjust(
              new Date(drawYear, drawMonth + stepMonths, 1)
            ),
            this._getFormatConfig(inst)
          );
      next = this._canAdjustMonth(inst, +1, drawYear, drawMonth)
        ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
          " title='" +
          nextText +
          "'><span class='ui-icon ui-icon-circle-triangle-" +
          (isRTL ? "w" : "e") +
          "'>" +
          nextText +
          "</span></a>"
        : hideIfNoPrevNext
        ? ""
        : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" +
          nextText +
          "'><span class='ui-icon ui-icon-circle-triangle-" +
          (isRTL ? "w" : "e") +
          "'>" +
          nextText +
          "</span></a>";
      currentText = this._get(inst, "currentText");
      gotoDate =
        this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today;
      currentText = !navigationAsDateFormat
        ? currentText
        : this.formatDate(currentText, gotoDate, this._getFormatConfig(inst));
      controls = !inst.inline
        ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
          this._get(inst, "closeText") +
          "</button>"
        : "";
      buttonPanel = showButtonPanel
        ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" +
          (isRTL ? controls : "") +
          (this._isInRange(inst, gotoDate)
            ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
              ">" +
              currentText +
              "</button>"
            : "") +
          (isRTL ? "" : controls) +
          "</div>"
        : "";
      firstDay = parseInt(this._get(inst, "firstDay"), 10);
      firstDay = isNaN(firstDay) ? 0 : firstDay;
      showWeek = this._get(inst, "showWeek");
      dayNames = this._get(inst, "dayNames");
      dayNamesMin = this._get(inst, "dayNamesMin");
      monthNames = this._get(inst, "monthNames");
      monthNamesShort = this._get(inst, "monthNamesShort");
      beforeShowDay = this._get(inst, "beforeShowDay");
      showOtherMonths = this._get(inst, "showOtherMonths");
      selectOtherMonths = this._get(inst, "selectOtherMonths");
      defaultDate = this._getDefaultDate(inst);
      html = "";
      dow;
      for (row = 0; row < numMonths[0]; row++) {
        group = "";
        this.maxRows = 4;
        for (col = 0; col < numMonths[1]; col++) {
          selectedDate = this._daylightSavingAdjust(
            new Date(drawYear, drawMonth, inst.selectedDay)
          );
          cornerClass = " ui-corner-all";
          calender = "";
          if (isMultiMonth) {
            calender += "<div class='ui-datepicker-group";
            if (numMonths[1] > 1) {
              switch (col) {
                case 0:
                  calender += " ui-datepicker-group-first";
                  cornerClass = " ui-corner-" + (isRTL ? "right" : "left");
                  break;
                case numMonths[1] - 1:
                  calender += " ui-datepicker-group-last";
                  cornerClass = " ui-corner-" + (isRTL ? "left" : "right");
                  break;
                default:
                  calender += " ui-datepicker-group-middle";
                  cornerClass = "";
                  break;
              }
            }
            calender += "'>";
          }
          calender +=
            "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" +
            cornerClass +
            "'>" +
            (/all|left/.test(cornerClass) && row === 0
              ? isRTL
                ? next
                : prev
              : "") +
            (/all|right/.test(cornerClass) && row === 0
              ? isRTL
                ? prev
                : next
              : "") +
            this._generateMonthYearHeader(
              inst,
              drawMonth,
              drawYear,
              minDate,
              maxDate,
              row > 0 || col > 0,
              monthNames,
              monthNamesShort
            ) +
            "</div><table class='ui-datepicker-calendar'><thead>" +
            "<tr>";
          thead = showWeek
            ? "<th class='ui-datepicker-week-col'>" +
              this._get(inst, "weekHeader") +
              "</th>"
            : "";
          for (dow = 0; dow < 7; dow++) {
            day = (dow + firstDay) % 7;
            thead +=
              "<th scope='col'" +
              ((dow + firstDay + 6) % 7 >= 5
                ? " class='ui-datepicker-week-end'"
                : "") +
              ">" +
              "<span title='" +
              dayNames[day] +
              "'>" +
              dayNamesMin[day] +
              "</span></th>";
          }
          calender += thead + "</tr></thead><tbody>";
          daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
          if (
            drawYear === inst.selectedYear &&
            drawMonth === inst.selectedMonth
          ) {
            inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
          }
          leadDays =
            (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
          curRows = Math.ceil((leadDays + daysInMonth) / 7);
          numRows = isMultiMonth
            ? this.maxRows > curRows
              ? this.maxRows
              : curRows
            : curRows;
          this.maxRows = numRows;
          printDate = this._daylightSavingAdjust(
            new Date(drawYear, drawMonth, 1 - leadDays)
          );
          for (dRow = 0; dRow < numRows; dRow++) {
            calender += "<tr>";
            tbody = !showWeek
              ? ""
              : "<td class='ui-datepicker-week-col'>" +
                this._get(inst, "calculateWeek")(printDate) +
                "</td>";
            for (dow = 0; dow < 7; dow++) {
              daySettings = beforeShowDay
                ? beforeShowDay.apply(inst.input ? inst.input[0] : null, [
                    printDate,
                  ])
                : [true, ""];
              otherMonth = printDate.getMonth() !== drawMonth;
              unselectable =
                (otherMonth && !selectOtherMonths) ||
                !daySettings[0] ||
                (minDate && printDate < minDate) ||
                (maxDate && printDate > maxDate);
              tbody +=
                "<td class='" +
                ((dow + firstDay + 6) % 7 >= 5
                  ? " ui-datepicker-week-end"
                  : "") +
                (otherMonth ? " ui-datepicker-other-month" : "") +
                ((printDate.getTime() === selectedDate.getTime() &&
                  drawMonth === inst.selectedMonth &&
                  inst._keyEvent) ||
                (defaultDate.getTime() === printDate.getTime() &&
                  defaultDate.getTime() === selectedDate.getTime())
                  ? " " + this._dayOverClass
                  : "") +
                (unselectable
                  ? " " + this._unselectableClass + " ui-state-disabled"
                  : "") +
                (otherMonth && !showOtherMonths
                  ? ""
                  : " " +
                    daySettings[1] +
                    (printDate.getTime() === currentDate.getTime()
                      ? " " + this._currentClass
                      : "") +
                    (printDate.getTime() === today.getTime()
                      ? " ui-datepicker-today"
                      : "")) +
                "'" +
                ((!otherMonth || showOtherMonths) && daySettings[2]
                  ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'"
                  : "") +
                (unselectable
                  ? ""
                  : " data-handler='selectDay' data-event='click' data-month='" +
                    printDate.getMonth() +
                    "' data-year='" +
                    printDate.getFullYear() +
                    "'") +
                ">" +
                (otherMonth && !showOtherMonths
                  ? "&#xa0;"
                  : unselectable
                  ? "<span class='ui-state-default'>" +
                    printDate.getDate() +
                    "</span>"
                  : "<a class='ui-state-default" +
                    (printDate.getTime() === today.getTime()
                      ? " ui-state-highlight"
                      : "") +
                    (printDate.getTime() === currentDate.getTime()
                      ? " ui-state-active"
                      : "") +
                    (otherMonth ? " ui-priority-secondary" : "") +
                    "' href='#'>" +
                    printDate.getDate() +
                    "</a>") +
                "</td>";
              printDate.setDate(printDate.getDate() + 1);
              printDate = this._daylightSavingAdjust(printDate);
            }
            calender += tbody + "</tr>";
          }
          drawMonth++;
          if (drawMonth > 11) {
            drawMonth = 0;
            drawYear++;
          }
          calender +=
            "</tbody></table>" +
            (isMultiMonth
              ? "</div>" +
                (numMonths[0] > 0 && col === numMonths[1] - 1
                  ? "<div class='ui-datepicker-row-break'></div>"
                  : "")
              : "");
          group += calender;
        }
        html += group;
      }
      html += buttonPanel;
      inst._keyEvent = false;
      return html;
    },
    _generateMonthYearHeader: function (
      inst,
      drawMonth,
      drawYear,
      minDate,
      maxDate,
      secondary,
      monthNames,
      monthNamesShort
    ) {
      var inMinYear,
        inMaxYear,
        month,
        years,
        thisYear,
        determineYear,
        year,
        endYear,
        changeMonth = this._get(inst, "changeMonth"),
        changeYear = this._get(inst, "changeYear"),
        showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
        html = "<div class='ui-datepicker-title'>",
        monthHtml = "";
      if (secondary || !changeMonth) {
        monthHtml +=
          "<span class='ui-datepicker-month'>" +
          monthNames[drawMonth] +
          "</span>";
      } else {
        inMinYear = minDate && minDate.getFullYear() === drawYear;
        inMaxYear = maxDate && maxDate.getFullYear() === drawYear;
        monthHtml +=
          "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
        for (month = 0; month < 12; month++) {
          if (
            (!inMinYear || month >= minDate.getMonth()) &&
            (!inMaxYear || month <= maxDate.getMonth())
          ) {
            monthHtml +=
              "<option value='" +
              month +
              "'" +
              (month === drawMonth ? " selected='selected'" : "") +
              ">" +
              monthNamesShort[month] +
              "</option>";
          }
        }
        monthHtml += "</select>";
      }
      if (!showMonthAfterYear) {
        html +=
          monthHtml +
          (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
      }
      if (!inst.yearshtml) {
        inst.yearshtml = "";
        if (secondary || !changeYear) {
          html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
        } else {
          years = this._get(inst, "yearRange").split(":");
          thisYear = new Date().getFullYear();
          determineYear = function (value) {
            var year = value.match(/c[+\-].*/)
              ? drawYear + parseInt(value.substring(1), 10)
              : value.match(/[+\-].*/)
              ? thisYear + parseInt(value, 10)
              : parseInt(value, 10);
            return isNaN(year) ? thisYear : year;
          };
          year = determineYear(years[0]);
          endYear = Math.max(year, determineYear(years[1] || ""));
          year = minDate ? Math.max(year, minDate.getFullYear()) : year;
          endYear = maxDate
            ? Math.min(endYear, maxDate.getFullYear())
            : endYear;
          inst.yearshtml +=
            "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
          for (; year <= endYear; year++) {
            inst.yearshtml +=
              "<option value='" +
              year +
              "'" +
              (year === drawYear ? " selected='selected'" : "") +
              ">" +
              year +
              "</option>";
          }
          inst.yearshtml += "</select>";
          html += inst.yearshtml;
          inst.yearshtml = null;
        }
      }
      html += this._get(inst, "yearSuffix");
      if (showMonthAfterYear) {
        html +=
          (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") +
          monthHtml;
      }
      html += "</div>";
      return html;
    },
    _adjustInstDate: function (inst, offset, period) {
      var year = inst.drawYear + (period === "Y" ? offset : 0),
        month = inst.drawMonth + (period === "M" ? offset : 0),
        day =
          Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
          (period === "D" ? offset : 0),
        date = this._restrictMinMax(
          inst,
          this._daylightSavingAdjust(new Date(year, month, day))
        );
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
      if (period === "M" || period === "Y") {
        this._notifyChange(inst);
      }
    },
    _restrictMinMax: function (inst, date) {
      var minDate = this._getMinMaxDate(inst, "min"),
        maxDate = this._getMinMaxDate(inst, "max"),
        newDate = minDate && date < minDate ? minDate : date;
      return maxDate && newDate > maxDate ? maxDate : newDate;
    },
    _notifyChange: function (inst) {
      var onChange = this._get(inst, "onChangeMonthYear");
      if (onChange) {
        onChange.apply(inst.input ? inst.input[0] : null, [
          inst.selectedYear,
          inst.selectedMonth + 1,
          inst,
        ]);
      }
    },
    _getNumberOfMonths: function (inst) {
      var numMonths = this._get(inst, "numberOfMonths");
      return numMonths == null
        ? [1, 1]
        : typeof numMonths === "number"
        ? [1, numMonths]
        : numMonths;
    },
    _getMinMaxDate: function (inst, minMax) {
      return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
    },
    _getDaysInMonth: function (year, month) {
      return (
        32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate()
      );
    },
    _getFirstDayOfMonth: function (year, month) {
      return new Date(year, month, 1).getDay();
    },
    _canAdjustMonth: function (inst, offset, curYear, curMonth) {
      var numMonths = this._getNumberOfMonths(inst),
        date = this._daylightSavingAdjust(
          new Date(
            curYear,
            curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]),
            1
          )
        );
      if (offset < 0) {
        date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
      }
      return this._isInRange(inst, date);
    },
    _isInRange: function (inst, date) {
      var yearSplit,
        currentYear,
        minDate = this._getMinMaxDate(inst, "min"),
        maxDate = this._getMinMaxDate(inst, "max"),
        minYear = null,
        maxYear = null,
        years = this._get(inst, "yearRange");
      if (years) {
        yearSplit = years.split(":");
        currentYear = new Date().getFullYear();
        minYear = parseInt(yearSplit[0], 10);
        maxYear = parseInt(yearSplit[1], 10);
        if (yearSplit[0].match(/[+\-].*/)) {
          minYear += currentYear;
        }
        if (yearSplit[1].match(/[+\-].*/)) {
          maxYear += currentYear;
        }
      }
      return (
        (!minDate || date.getTime() >= minDate.getTime()) &&
        (!maxDate || date.getTime() <= maxDate.getTime()) &&
        (!minYear || date.getFullYear() >= minYear) &&
        (!maxYear || date.getFullYear() <= maxYear)
      );
    },
    _getFormatConfig: function (inst) {
      var shortYearCutoff = this._get(inst, "shortYearCutoff");
      shortYearCutoff =
        typeof shortYearCutoff !== "string"
          ? shortYearCutoff
          : (new Date().getFullYear() % 100) + parseInt(shortYearCutoff, 10);
      return {
        shortYearCutoff: shortYearCutoff,
        dayNamesShort: this._get(inst, "dayNamesShort"),
        dayNames: this._get(inst, "dayNames"),
        monthNamesShort: this._get(inst, "monthNamesShort"),
        monthNames: this._get(inst, "monthNames"),
      };
    },
    _formatDate: function (inst, day, month, year) {
      if (!day) {
        inst.currentDay = inst.selectedDay;
        inst.currentMonth = inst.selectedMonth;
        inst.currentYear = inst.selectedYear;
      }
      var date = day
        ? typeof day === "object"
          ? day
          : this._daylightSavingAdjust(new Date(year, month, day))
        : this._daylightSavingAdjust(
            new Date(inst.currentYear, inst.currentMonth, inst.currentDay)
          );
      return this.formatDate(
        this._get(inst, "dateFormat"),
        date,
        this._getFormatConfig(inst)
      );
    },
  });
  function datepicker_bindHover(dpDiv) {
    var selector =
      "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return dpDiv
      .on("mouseout", selector, function () {
        $(this).removeClass("ui-state-hover");
        if (this.className.indexOf("ui-datepicker-prev") !== -1) {
          $(this).removeClass("ui-datepicker-prev-hover");
        }
        if (this.className.indexOf("ui-datepicker-next") !== -1) {
          $(this).removeClass("ui-datepicker-next-hover");
        }
      })
      .on("mouseover", selector, datepicker_handleMouseover);
  }
  function datepicker_handleMouseover() {
    if (
      !$.datepicker._isDisabledDatepicker(
        datepicker_instActive.inline
          ? datepicker_instActive.dpDiv.parent()[0]
          : datepicker_instActive.input[0]
      )
    ) {
      $(this)
        .parents(".ui-datepicker-calendar")
        .find("a")
        .removeClass("ui-state-hover");
      $(this).addClass("ui-state-hover");
      if (this.className.indexOf("ui-datepicker-prev") !== -1) {
        $(this).addClass("ui-datepicker-prev-hover");
      }
      if (this.className.indexOf("ui-datepicker-next") !== -1) {
        $(this).addClass("ui-datepicker-next-hover");
      }
    }
  }
  function datepicker_extendRemove(target, props) {
    $.extend(target, props);
    for (var name in props) {
      if (props[name] == null) {
        target[name] = props[name];
      }
    }
    return target;
  }
  $.fn.datepicker = function (options) {
    if (!this.length) {
      return this;
    }
    if (!$.datepicker.initialized) {
      $(document).on("mousedown", $.datepicker._checkExternalClick);
      $.datepicker.initialized = true;
    }
    if ($("#" + $.datepicker._mainDivId).length === 0) {
      $("body").append($.datepicker.dpDiv);
    }
    var otherArgs = Array.prototype.slice.call(arguments, 1);
    if (
      typeof options === "string" &&
      (options === "isDisabled" ||
        options === "getDate" ||
        options === "widget")
    ) {
      return $.datepicker["_" + options + "Datepicker"].apply(
        $.datepicker,
        [this[0]].concat(otherArgs)
      );
    }
    if (
      options === "option" &&
      arguments.length === 2 &&
      typeof arguments[1] === "string"
    ) {
      return $.datepicker["_" + options + "Datepicker"].apply(
        $.datepicker,
        [this[0]].concat(otherArgs)
      );
    }
    return this.each(function () {
      typeof options === "string"
        ? $.datepicker["_" + options + "Datepicker"].apply(
            $.datepicker,
            [this].concat(otherArgs)
          )
        : $.datepicker._attachDatepicker(this, options);
    });
  };
  $.datepicker = new Datepicker();
  $.datepicker.initialized = false;
  $.datepicker.uuid = new Date().getTime();
  $.datepicker.version = "@VERSION";
  return $.datepicker;
});

(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["../datepicker"], factory);
  } else {
    factory(jQuery.datepicker);
  }
})(function (datepicker) {
  datepicker.regional["cs"] = {
    closeText: "ZavÅ™Ã­t",
    prevText: "&#x3C;DÅ™Ã­ve",
    nextText: "PozdÄ›ji&#x3E;",
    currentText: "NynÃ­",
    monthNames: [
      "leden",
      "Ãºnor",
      "bÅ™ezen",
      "duben",
      "kvÄ›ten",
      "Äerven",
      "Äervenec",
      "srpen",
      "zÃ¡Å™Ã­",
      "Å™Ã­jen",
      "listopad",
      "prosinec",
    ],
    monthNamesShort: [
      "led",
      "Ãºno",
      "bÅ™e",
      "dub",
      "kvÄ›",
      "Äer",
      "Ävc",
      "srp",
      "zÃ¡Å™",
      "Å™Ã­j",
      "lis",
      "pro",
    ],
    dayNames: [
      "nedÄ›le",
      "pondÄ›lÃ­",
      "ÃºterÃ½",
      "stÅ™eda",
      "Ätvrtek",
      "pÃ¡tek",
      "sobota",
    ],
    dayNamesShort: ["ne", "po", "Ãºt", "st", "Ät", "pÃ¡", "so"],
    dayNamesMin: ["ne", "po", "Ãºt", "st", "Ät", "pÃ¡", "so"],
    weekHeader: "TÃ½d",
    dateFormat: "d.m.yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: "",
  };
  datepicker.setDefaults(datepicker.regional["cs"]);
  return datepicker.regional["cs"];
});

/*!
 * jQuery UI Menu @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./core", "./widget", "./position"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  return $.widget("ui.menu", {
    version: "@VERSION",
    defaultElement: "<ul>",
    delay: 300,
    options: {
      icons: { submenu: "ui-icon-caret-1-e" },
      items: "> *",
      menus: "ul",
      position: { my: "left top", at: "right top" },
      role: "menu",
      blur: null,
      focus: null,
      select: null,
    },
    _create: function () {
      this.activeMenu = this.element;
      this.mouseHandled = false;
      this.element.uniqueId().attr({ role: this.options.role, tabIndex: 0 });
      if (this.options.disabled) {
        this._addClass(null, "ui-state-disabled");
        this.element.attr("aria-disabled", "true");
      }
      this._addClass("ui-menu", "ui-widget ui-widget-content");
      this._on({
        "mousedown .ui-menu-item": function (event) {
          event.preventDefault();
        },
        "click .ui-menu-item": function (event) {
          var target = $(event.target);
          if (!this.mouseHandled && target.not(".ui-state-disabled").length) {
            this.select(event);
            if (!event.isPropagationStopped()) {
              this.mouseHandled = true;
            }
            if (target.has(".ui-menu").length) {
              this.expand(event);
            } else if (
              !this.element.is(":focus") &&
              $($.ui.safeActiveElement(this.document[0])).closest(".ui-menu")
                .length
            ) {
              this.element.trigger("focus", [true]);
              if (this.active && this.active.parents(".ui-menu").length === 1) {
                clearTimeout(this.timer);
              }
            }
          }
        },
        "mouseenter .ui-menu-item": function (event) {
          if (this.previousFilter) {
            return;
          }
          var actualTarget = $(event.target).closest(".ui-menu-item"),
            target = $(event.currentTarget);
          if (actualTarget[0] !== target[0]) {
            return;
          }
          this._removeClass(
            target.siblings().children(".ui-state-active"),
            null,
            "ui-state-active"
          );
          this.focus(event, target);
        },
        mouseleave: "collapseAll",
        "mouseleave .ui-menu": "collapseAll",
        focus: function (event, keepActiveItem) {
          var item = this.active || this.element.find(this.options.items).eq(0);
          if (!keepActiveItem) {
            this.focus(event, item);
          }
        },
        blur: function (event) {
          this._delay(function () {
            if (
              !$.contains(
                this.element[0],
                $.ui.safeActiveElement(this.document[0])
              )
            ) {
              this.collapseAll(event);
            }
          });
        },
        keydown: "_keydown",
      });
      this.refresh();
      this._on(this.document, {
        click: function (event) {
          if (this._closeOnDocumentClick(event)) {
            this.collapseAll(event);
          }
          this.mouseHandled = false;
        },
      });
    },
    _destroy: function () {
      var items = this.element
          .find(".ui-menu-item")
          .removeAttr("role aria-disabled"),
        submenus = items
          .children(".ui-menu-item-wrapper")
          .removeUniqueId()
          .removeAttr("tabIndex role aria-haspopup");
      this.element
        .removeAttr("aria-activedescendant")
        .find(".ui-menu")
        .addBack()
        .removeAttr(
          "role aria-labelledby aria-expanded aria-hidden aria-disabled " +
            "tabIndex"
        )
        .removeUniqueId()
        .show();
      submenus.children().each(function () {
        var elem = $(this);
        if (elem.data("ui-menu-submenu-caret")) {
          elem.remove();
        }
      });
    },
    _keydown: function (event) {
      var match,
        prev,
        character,
        skip,
        preventDefault = true;
      switch (event.keyCode) {
        case $.ui.keyCode.PAGE_UP:
          this.previousPage(event);
          break;
        case $.ui.keyCode.PAGE_DOWN:
          this.nextPage(event);
          break;
        case $.ui.keyCode.HOME:
          this._move("first", "first", event);
          break;
        case $.ui.keyCode.END:
          this._move("last", "last", event);
          break;
        case $.ui.keyCode.UP:
          this.previous(event);
          break;
        case $.ui.keyCode.DOWN:
          this.next(event);
          break;
        case $.ui.keyCode.LEFT:
          this.collapse(event);
          break;
        case $.ui.keyCode.RIGHT:
          if (this.active && !this.active.is(".ui-state-disabled")) {
            this.expand(event);
          }
          break;
        case $.ui.keyCode.ENTER:
        case $.ui.keyCode.SPACE:
          this._activate(event);
          break;
        case $.ui.keyCode.ESCAPE:
          this.collapse(event);
          break;
        default:
          preventDefault = false;
          prev = this.previousFilter || "";
          character = String.fromCharCode(event.keyCode);
          skip = false;
          clearTimeout(this.filterTimer);
          if (character === prev) {
            skip = true;
          } else {
            character = prev + character;
          }
          match = this._filterMenuItems(character);
          match =
            skip && match.index(this.active.next()) !== -1
              ? this.active.nextAll(".ui-menu-item")
              : match;
          if (!match.length) {
            character = String.fromCharCode(event.keyCode);
            match = this._filterMenuItems(character);
          }
          if (match.length) {
            this.focus(event, match);
            this.previousFilter = character;
            this.filterTimer = this._delay(function () {
              delete this.previousFilter;
            }, 1e3);
          } else {
            delete this.previousFilter;
          }
      }
      if (preventDefault) {
        event.preventDefault();
      }
    },
    _activate: function (event) {
      if (!this.active.is(".ui-state-disabled")) {
        if (this.active.children("[aria-haspopup='true']").length) {
          this.expand(event);
        } else {
          this.select(event);
        }
      }
    },
    refresh: function () {
      var menus,
        items,
        newSubmenus,
        newItems,
        newWrappers,
        that = this,
        icon = this.options.icons.submenu,
        submenus = this.element.find(this.options.menus);
      this._toggleClass(
        "ui-menu-icons",
        null,
        !!this.element.find(".ui-icon").length
      );
      newSubmenus = submenus
        .filter(":not(.ui-menu)")
        .hide()
        .attr({
          role: this.options.role,
          "aria-hidden": "true",
          "aria-expanded": "false",
        })
        .each(function () {
          var menu = $(this),
            item = menu.prev(),
            submenuCaret = $("<span>").data("ui-menu-submenu-caret", true);
          that._addClass(submenuCaret, "ui-menu-icon", "ui-icon " + icon);
          item.attr("aria-haspopup", "true").prepend(submenuCaret);
          menu.attr("aria-labelledby", item.attr("id"));
        });
      this._addClass(
        newSubmenus,
        "ui-menu",
        "ui-widget ui-widget-content ui-front"
      );
      menus = submenus.add(this.element);
      items = menus.find(this.options.items);
      items.not(".ui-menu-item").each(function () {
        var item = $(this);
        if (that._isDivider(item)) {
          that._addClass(item, "ui-menu-divider", "ui-widget-content");
        }
      });
      newItems = items.not(".ui-menu-item, .ui-menu-divider");
      newWrappers = newItems
        .children()
        .not(".ui-menu")
        .uniqueId()
        .attr({ tabIndex: -1, role: this._itemRole() });
      this._addClass(newItems, "ui-menu-item")._addClass(
        newWrappers,
        "ui-menu-item-wrapper"
      );
      items.filter(".ui-state-disabled").attr("aria-disabled", "true");
      if (this.active && !$.contains(this.element[0], this.active[0])) {
        this.blur();
      }
    },
    _itemRole: function () {
      return { menu: "menuitem", listbox: "option" }[this.options.role];
    },
    _setOption: function (key, value) {
      if (key === "icons") {
        var icons = this.element.find(".ui-menu-icon");
        this._removeClass(icons, null, this.options.icons.submenu)._addClass(
          icons,
          null,
          value.submenu
        );
      }
      if (key === "disabled") {
        this.element.attr("aria-disabled", value);
        this._toggleClass(null, "ui-state-disabled", !!value);
      }
      this._super(key, value);
    },
    focus: function (event, item) {
      var nested, focused, activeParent;
      this.blur(event, event && event.type === "focus");
      this._scrollIntoView(item);
      this.active = item.first();
      focused = this.active.children(".ui-menu-item-wrapper");
      this._addClass(focused, null, "ui-state-active");
      if (this.options.role) {
        this.element.attr("aria-activedescendant", focused.attr("id"));
      }
      activeParent = this.active
        .parent()
        .closest(".ui-menu-item")
        .children(".ui-menu-item-wrapper");
      this._addClass(activeParent, null, "ui-state-active");
      if (event && event.type === "keydown") {
        this._close();
      } else {
        this.timer = this._delay(function () {
          this._close();
        }, this.delay);
      }
      nested = item.children(".ui-menu");
      if (nested.length && event && /^mouse/.test(event.type)) {
        this._startOpening(nested);
      }
      this.activeMenu = item.parent();
      this._trigger("focus", event, { item: item });
    },
    _scrollIntoView: function (item) {
      var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
      if (this._hasScroll()) {
        borderTop =
          parseFloat($.css(this.activeMenu[0], "borderTopWidth")) || 0;
        paddingTop = parseFloat($.css(this.activeMenu[0], "paddingTop")) || 0;
        offset =
          item.offset().top -
          this.activeMenu.offset().top -
          borderTop -
          paddingTop;
        scroll = this.activeMenu.scrollTop();
        elementHeight = this.activeMenu.height();
        itemHeight = item.outerHeight();
        if (offset < 0) {
          this.activeMenu.scrollTop(scroll + offset);
        } else if (offset + itemHeight > elementHeight) {
          this.activeMenu.scrollTop(
            scroll + offset - elementHeight + itemHeight
          );
        }
      }
    },
    blur: function (event, fromFocus) {
      if (!fromFocus) {
        clearTimeout(this.timer);
      }
      if (!this.active) {
        return;
      }
      this._removeClass(
        this.active.children(".ui-menu-item-wrapper"),
        null,
        "ui-state-active"
      );
      this.active = null;
      this._trigger("blur", event, { item: this.active });
    },
    _startOpening: function (submenu) {
      clearTimeout(this.timer);
      if (submenu.attr("aria-hidden") !== "true") {
        return;
      }
      this.timer = this._delay(function () {
        this._close();
        this._open(submenu);
      }, this.delay);
    },
    _open: function (submenu) {
      var position = $.extend({ of: this.active }, this.options.position);
      clearTimeout(this.timer);
      this.element
        .find(".ui-menu")
        .not(submenu.parents(".ui-menu"))
        .hide()
        .attr("aria-hidden", "true");
      submenu
        .show()
        .removeAttr("aria-hidden")
        .attr("aria-expanded", "true")
        .position(position);
    },
    collapseAll: function (event, all) {
      clearTimeout(this.timer);
      this.timer = this._delay(function () {
        var currentMenu = all
          ? this.element
          : $(event && event.target).closest(this.element.find(".ui-menu"));
        if (!currentMenu.length) {
          currentMenu = this.element;
        }
        this._close(currentMenu);
        this.blur(event);
        this.activeMenu = currentMenu;
      }, this.delay);
    },
    _close: function (startMenu) {
      if (!startMenu) {
        startMenu = this.active ? this.active.parent() : this.element;
      }
      var active = startMenu
        .find(".ui-menu")
        .hide()
        .attr("aria-hidden", "true")
        .attr("aria-expanded", "false")
        .end()
        .find(".ui-state-active")
        .not(".ui-menu-item-wrapper");
      this._removeClass(active, null, "ui-state-active");
    },
    _closeOnDocumentClick: function (event) {
      return !$(event.target).closest(".ui-menu").length;
    },
    _isDivider: function (item) {
      return !/[^\-\u2014\u2013\s]/.test(item.text());
    },
    collapse: function (event) {
      var newItem =
        this.active &&
        this.active.parent().closest(".ui-menu-item", this.element);
      if (newItem && newItem.length) {
        this._close();
        this.focus(event, newItem);
      }
    },
    expand: function (event) {
      var newItem =
        this.active &&
        this.active.children(".ui-menu ").find(this.options.items).first();
      if (newItem && newItem.length) {
        this._open(newItem.parent());
        this._delay(function () {
          this.focus(event, newItem);
        });
      }
    },
    next: function (event) {
      this._move("next", "first", event);
    },
    previous: function (event) {
      this._move("prev", "last", event);
    },
    isFirstItem: function () {
      return this.active && !this.active.prevAll(".ui-menu-item").length;
    },
    isLastItem: function () {
      return this.active && !this.active.nextAll(".ui-menu-item").length;
    },
    _move: function (direction, filter, event) {
      var next;
      if (this.active) {
        if (direction === "first" || direction === "last") {
          next = this.active[direction === "first" ? "prevAll" : "nextAll"](
            ".ui-menu-item"
          ).eq(-1);
        } else {
          next = this.active[direction + "All"](".ui-menu-item").eq(0);
        }
      }
      if (!next || !next.length || !this.active) {
        next = this.activeMenu.find(this.options.items)[filter]();
      }
      this.focus(event, next);
    },
    nextPage: function (event) {
      var item, base, height;
      if (!this.active) {
        this.next(event);
        return;
      }
      if (this.isLastItem()) {
        return;
      }
      if (this._hasScroll()) {
        base = this.active.offset().top;
        height = this.element.height();
        this.active.nextAll(".ui-menu-item").each(function () {
          item = $(this);
          return item.offset().top - base - height < 0;
        });
        this.focus(event, item);
      } else {
        this.focus(
          event,
          this.activeMenu
            .find(this.options.items)
            [!this.active ? "first" : "last"]()
        );
      }
    },
    previousPage: function (event) {
      var item, base, height;
      if (!this.active) {
        this.next(event);
        return;
      }
      if (this.isFirstItem()) {
        return;
      }
      if (this._hasScroll()) {
        base = this.active.offset().top;
        height = this.element.height();
        this.active.prevAll(".ui-menu-item").each(function () {
          item = $(this);
          return item.offset().top - base + height > 0;
        });
        this.focus(event, item);
      } else {
        this.focus(event, this.activeMenu.find(this.options.items).first());
      }
    },
    _hasScroll: function () {
      return this.element.outerHeight() < this.element.prop("scrollHeight");
    },
    select: function (event) {
      this.active = this.active || $(event.target).closest(".ui-menu-item");
      var ui = { item: this.active };
      if (!this.active.has(".ui-menu").length) {
        this.collapseAll(event, true);
      }
      this._trigger("select", event, ui);
    },
    _filterMenuItems: function (character) {
      var escapedCharacter = character.replace(
          /[\-\[\]{}()*+?.,\\\^$|#\s]/g,
          "\\$&"
        ),
        regex = new RegExp("^" + escapedCharacter, "i");
      return this.activeMenu
        .find(this.options.items)
        .filter(".ui-menu-item")
        .filter(function () {
          return regex.test(
            $.trim($(this).children(".ui-menu-item-wrapper").text())
          );
        });
    },
  });
});

/*!
 * jQuery UI Selectmenu @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./core", "./widget", "./position", "./menu"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  return $.widget("ui.selectmenu", {
    version: "@VERSION",
    defaultElement: "<select>",
    options: {
      appendTo: null,
      classes: {
        "ui-selectmenu-button-open": "ui-corner-top",
        "ui-selectmenu-button-closed": "ui-corner-all",
      },
      disabled: null,
      icons: { button: "ui-icon-triangle-1-s" },
      position: { my: "left top", at: "left bottom", collision: "none" },
      width: false,
      change: null,
      close: null,
      focus: null,
      open: null,
      select: null,
    },
    _create: function () {
      var selectmenuId = this.element.uniqueId().attr("id");
      this.ids = {
        element: selectmenuId,
        button: selectmenuId + "-button",
        menu: selectmenuId + "-menu",
      };
      this._drawButton();
      this._drawMenu();
      this._rendered = false;
      this.menuItems = $();
      if (this.options.disabled) {
        this.disable();
      }
    },
    _drawButton: function () {
      var icon,
        that = this,
        item = this._parseOption(
          this.element.find("option:selected"),
          this.element[0].selectedIndex
        );
      this.labels = this.element.labels().attr("for", this.ids.button);
      this._on(this.labels, {
        click: function (event) {
          this.button.focus();
          event.preventDefault();
        },
      });
      this.element.hide();
      this.button = $("<span>", {
        tabindex: this.options.disabled ? -1 : 0,
        id: this.ids.button,
        role: "combobox",
        "aria-expanded": "false",
        "aria-autocomplete": "list",
        "aria-owns": this.ids.menu,
        "aria-haspopup": "true",
        title: this.element.attr("title"),
      }).insertAfter(this.element);
      this._addClass(
        this.button,
        "ui-selectmenu-button ui-selectmenu-button-closed",
        "ui-widget ui-state-default"
      );
      icon = $("<span>").prependTo(this.button);
      this._addClass(icon, null, "ui-icon " + this.options.icons.button);
      this.buttonItem = this._renderButtonItem(item).appendTo(this.button);
      if (this.options.width !== false) {
        this._resizeButton();
      }
      this._on(this.button, this._buttonEvents);
      this.button.one("focusin", function () {
        if (!that._rendered) {
          that._refreshMenu();
        }
      });
      this._hoverable(this.button);
      this._focusable(this.button);
    },
    _drawMenu: function () {
      var that = this;
      this.menu = $("<ul>", {
        "aria-hidden": "true",
        "aria-labelledby": this.ids.button,
        id: this.ids.menu,
      });
      this.menuWrap = $("<div>").append(this.menu);
      this._addClass(this.menuWrap, "ui-selectmenu-menu", "ui-front");
      this.menuWrap.appendTo(this._appendTo());
      this.menuInstance = this.menu
        .menu({
          classes: { "ui-menu": "ui-corner-bottom" },
          role: "listbox",
          select: function (event, ui) {
            event.preventDefault();
            that._setSelection();
            that._select(ui.item.data("ui-selectmenu-item"), event);
          },
          focus: function (event, ui) {
            var item = ui.item.data("ui-selectmenu-item");
            if (that.focusIndex != null && item.index !== that.focusIndex) {
              that._trigger("focus", event, { item: item });
              if (!that.isOpen) {
                that._select(item, event);
              }
            }
            that.focusIndex = item.index;
            that.button.attr(
              "aria-activedescendant",
              that.menuItems.eq(item.index).attr("id")
            );
          },
        })
        .menu("instance");
      this.menuInstance._off(this.menu, "mouseleave");
      this.menuInstance._closeOnDocumentClick = function () {
        return false;
      };
      this.menuInstance._isDivider = function () {
        return false;
      };
    },
    refresh: function () {
      this._refreshMenu();
      this.buttonItem.replaceWith(
        (this.buttonItem = this._renderButtonItem(
          this._getSelectedItem().data("ui-selectmenu-item") || {}
        ))
      );
      if (this.options.width === null) {
        this._resizeButton();
      }
    },
    _refreshMenu: function () {
      var item,
        options = this.element.find("option");
      this.menu.empty();
      this._parseOptions(options);
      this._renderMenu(this.menu, this.items);
      this.menuInstance.refresh();
      this.menuItems = this.menu
        .find("li")
        .not(".ui-selectmenu-optgroup")
        .find(".ui-menu-item-wrapper");
      this._rendered = true;
      if (!options.length) {
        return;
      }
      item = this._getSelectedItem();
      this.menuInstance.focus(null, item);
      this._setAria(item.data("ui-selectmenu-item"));
      this._setOption("disabled", this.element.prop("disabled"));
    },
    open: function (event) {
      if (this.options.disabled) {
        return;
      }
      if (!this._rendered) {
        this._refreshMenu();
      } else {
        this._removeClass(
          this.menu.find(".ui-state-active"),
          null,
          "ui-state-active"
        );
        this.menuInstance.focus(null, this._getSelectedItem());
      }
      if (!this.menuItems.length) {
        return;
      }
      this.isOpen = true;
      this._toggleAttr();
      this._resizeMenu();
      this._position();
      this._on(this.document, this._documentClick);
      this._trigger("open", event);
    },
    _position: function () {
      this.menuWrap.position(
        $.extend({ of: this.button }, this.options.position)
      );
    },
    close: function (event) {
      if (!this.isOpen) {
        return;
      }
      this.isOpen = false;
      this._toggleAttr();
      this.range = null;
      this._off(this.document);
      this._trigger("close", event);
    },
    widget: function () {
      return this.button;
    },
    menuWidget: function () {
      return this.menu;
    },
    _renderButtonItem: function (item) {
      var buttonItem = $("<span>");
      this._setText(buttonItem, item.label);
      this._addClass(buttonItem, "ui-selectmenu-text");
      return buttonItem;
    },
    _renderMenu: function (ul, items) {
      var that = this,
        currentOptgroup = "";
      $.each(items, function (index, item) {
        var li;
        if (item.optgroup !== currentOptgroup) {
          li = $("<li>", { text: item.optgroup });
          that._addClass(
            li,
            "ui-selectmenu-optgroup",
            "ui-menu-divider" +
              (item.element.parent("optgroup").prop("disabled")
                ? " ui-state-disabled"
                : "")
          );
          li.appendTo(ul);
          currentOptgroup = item.optgroup;
        }
        that._renderItemData(ul, item);
      });
    },
    _renderItemData: function (ul, item) {
      return this._renderItem(ul, item).data("ui-selectmenu-item", item);
    },
    _renderItem: function (ul, item) {
      var li = $("<li>"),
        wrapper = $("<div>", { title: item.element.attr("title") });
      if (item.disabled) {
        this._addClass(li, null, "ui-state-disabled");
      }
      this._setText(wrapper, item.label);
      return li.append(wrapper).appendTo(ul);
    },
    _setText: function (element, value) {
      if (value) {
        element.text(value);
      } else {
        element.html("&#160;");
      }
    },
    _move: function (direction, event) {
      var item,
        next,
        filter = ".ui-menu-item";
      if (this.isOpen) {
        item = this.menuItems.eq(this.focusIndex).parent("li");
      } else {
        item = this.menuItems.eq(this.element[0].selectedIndex).parent("li");
        filter += ":not(.ui-state-disabled)";
      }
      if (direction === "first" || direction === "last") {
        next = item[direction === "first" ? "prevAll" : "nextAll"](filter).eq(
          -1
        );
      } else {
        next = item[direction + "All"](filter).eq(0);
      }
      if (next.length) {
        this.menuInstance.focus(event, next);
      }
    },
    _getSelectedItem: function () {
      return this.menuItems.eq(this.element[0].selectedIndex).parent("li");
    },
    _toggle: function (event) {
      this[this.isOpen ? "close" : "open"](event);
    },
    _setSelection: function () {
      var selection;
      if (!this.range) {
        return;
      }
      if (window.getSelection) {
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.range);
      } else {
        this.range.select();
      }
      this.button.focus();
    },
    _documentClick: {
      mousedown: function (event) {
        if (!this.isOpen) {
          return;
        }
        if (
          !$(event.target).closest(
            ".ui-selectmenu-menu, #" + $.ui.escapeSelector(this.ids.button)
          ).length
        ) {
          this.close(event);
        }
      },
    },
    _buttonEvents: {
      mousedown: function () {
        var selection;
        if (window.getSelection) {
          selection = window.getSelection();
          if (selection.rangeCount) {
            this.range = selection.getRangeAt(0);
          }
        } else {
          this.range = document.selection.createRange();
        }
      },
      click: function (event) {
        this._setSelection();
        this._toggle(event);
      },
      keydown: function (event) {
        var preventDefault = true;
        switch (event.keyCode) {
          case $.ui.keyCode.TAB:
          case $.ui.keyCode.ESCAPE:
            this.close(event);
            preventDefault = false;
            break;
          case $.ui.keyCode.ENTER:
            if (this.isOpen) {
              this._selectFocusedItem(event);
            }
            break;
          case $.ui.keyCode.UP:
            if (event.altKey) {
              this._toggle(event);
            } else {
              this._move("prev", event);
            }
            break;
          case $.ui.keyCode.DOWN:
            if (event.altKey) {
              this._toggle(event);
            } else {
              this._move("next", event);
            }
            break;
          case $.ui.keyCode.SPACE:
            if (this.isOpen) {
              this._selectFocusedItem(event);
            } else {
              this._toggle(event);
            }
            break;
          case $.ui.keyCode.LEFT:
            this._move("prev", event);
            break;
          case $.ui.keyCode.RIGHT:
            this._move("next", event);
            break;
          case $.ui.keyCode.HOME:
          case $.ui.keyCode.PAGE_UP:
            this._move("first", event);
            break;
          case $.ui.keyCode.END:
          case $.ui.keyCode.PAGE_DOWN:
            this._move("last", event);
            break;
          default:
            this.menu.trigger(event);
            preventDefault = false;
        }
        if (preventDefault) {
          event.preventDefault();
        }
      },
    },
    _selectFocusedItem: function (event) {
      var item = this.menuItems.eq(this.focusIndex).parent("li");
      if (!item.hasClass("ui-state-disabled")) {
        this._select(item.data("ui-selectmenu-item"), event);
      }
    },
    _select: function (item, event) {
      var oldIndex = this.element[0].selectedIndex;
      this.element[0].selectedIndex = item.index;
      this.buttonItem.replaceWith(
        (this.buttonItem = this._renderButtonItem(item))
      );
      this._setAria(item);
      this._trigger("select", event, { item: item });
      if (item.index !== oldIndex) {
        this._trigger("change", event, { item: item });
      }
      this.close(event);
    },
    _setAria: function (item) {
      var id = this.menuItems.eq(item.index).attr("id");
      this.button.attr({ "aria-labelledby": id, "aria-activedescendant": id });
      this.menu.attr("aria-activedescendant", id);
    },
    _setOption: function (key, value) {
      if (key === "icons") {
        var icon = this.button.find("span.ui-icon");
        this._removeClass(icon, null, this.options.icons.button)._addClass(
          icon,
          null,
          value.button
        );
      }
      this._super(key, value);
      if (key === "appendTo") {
        this.menuWrap.appendTo(this._appendTo());
      }
      if (key === "disabled") {
        this.menuInstance.option("disabled", value);
        this.button.attr("aria-disabled", value);
        this._toggleClass(this.button, null, "ui-state-disabled", value);
        this.element.prop("disabled", value);
        if (value) {
          this.button.attr("tabindex", -1);
          this.close();
        } else {
          this.button.attr("tabindex", 0);
        }
      }
      if (key === "width") {
        this._resizeButton();
      }
    },
    _appendTo: function () {
      var element = this.options.appendTo;
      if (element) {
        element =
          element.jquery || element.nodeType
            ? $(element)
            : this.document.find(element).eq(0);
      }
      if (!element || !element[0]) {
        element = this.element.closest(".ui-front, dialog");
      }
      if (!element.length) {
        element = this.document[0].body;
      }
      return element;
    },
    _toggleAttr: function () {
      this.button.attr("aria-expanded", this.isOpen);
      this._removeClass(
        this.button,
        "ui-selectmenu-button-" + (this.isOpen ? "closed" : "open")
      )
        ._addClass(
          this.button,
          "ui-selectmenu-button-" + (this.isOpen ? "open" : "closed")
        )
        ._toggleClass(this.menuWrap, "ui-selectmenu-open", null, this.isOpen);
      this.menu.attr("aria-hidden", !this.isOpen);
    },
    _resizeButton: function () {
      var width = this.options.width;
      if (width === false) {
        this.button.css("width", "");
        return;
      }
      if (width === null) {
        width = this.element.show().outerWidth();
        this.element.hide();
      }
      this.button.outerWidth(width);
    },
    _resizeMenu: function () {
      this.menu.outerWidth(
        Math.max(this.button.outerWidth(), this.menu.width("").outerWidth() + 1)
      );
    },
    _getCreateOptions: function () {
      return { disabled: this.element.prop("disabled") };
    },
    _parseOptions: function (options) {
      var that = this,
        data = [];
      options.each(function (index, item) {
        data.push(that._parseOption($(item), index));
      });
      this.items = data;
    },
    _parseOption: function (option, index) {
      var optgroup = option.parent("optgroup");
      return {
        element: option,
        index: index,
        value: option.val(),
        label: option.text(),
        optgroup: optgroup.attr("label") || "",
        disabled: optgroup.prop("disabled") || option.prop("disabled"),
      };
    },
    _destroy: function () {
      this.menuWrap.remove();
      this.button.remove();
      this.element.show();
      this.element.removeUniqueId();
      this.labels.attr("for", this.ids.element);
    },
  });
});

/*!
 * jQuery UI Slider @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./core", "./mouse", "./widget"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {
  return $.widget("ui.slider", $.ui.mouse, {
    version: "@VERSION",
    widgetEventPrefix: "slide",
    options: {
      animate: false,
      classes: {
        "ui-slider": "ui-corner-all",
        "ui-slider-handle": "ui-corner-all",
        "ui-slider-range": "ui-corner-all ui-widget-header",
      },
      distance: 0,
      max: 100,
      min: 0,
      orientation: "horizontal",
      range: false,
      step: 1,
      value: 0,
      values: null,
      change: null,
      slide: null,
      start: null,
      stop: null,
    },
    numPages: 5,
    _create: function () {
      this._keySliding = false;
      this._mouseSliding = false;
      this._animateOff = true;
      this._handleIndex = null;
      this._detectOrientation();
      this._mouseInit();
      this._calculateNewMax();
      this._addClass(
        "ui-slider ui-slider-" + this.orientation,
        "ui-widget ui-widget-content"
      );
      this._refresh();
      this._setOption("disabled", this.options.disabled);
      this._animateOff = false;
    },
    _refresh: function () {
      this._createRange();
      this._createHandles();
      this._setupEvents();
      this._refreshValue();
    },
    _createHandles: function () {
      var i,
        handleCount,
        options = this.options,
        existingHandles = this.element.find(".ui-slider-handle"),
        handle = "<span tabindex='0'></span>",
        handles = [];
      handleCount = (options.values && options.values.length) || 1;
      if (existingHandles.length > handleCount) {
        existingHandles.slice(handleCount).remove();
        existingHandles = existingHandles.slice(0, handleCount);
      }
      for (i = existingHandles.length; i < handleCount; i++) {
        handles.push(handle);
      }
      this.handles = existingHandles.add(
        $(handles.join("")).appendTo(this.element)
      );
      this._addClass(this.handles, "ui-slider-handle", "ui-state-default");
      this.handle = this.handles.eq(0);
      this.handles.each(function (i) {
        $(this).data("ui-slider-handle-index", i);
      });
    },
    _createRange: function () {
      var options = this.options;
      if (options.range) {
        if (options.range === true) {
          if (!options.values) {
            options.values = [this._valueMin(), this._valueMin()];
          } else if (options.values.length && options.values.length !== 2) {
            options.values = [options.values[0], options.values[0]];
          } else if ($.isArray(options.values)) {
            options.values = options.values.slice(0);
          }
        }
        if (!this.range || !this.range.length) {
          this.range = $("<div>").appendTo(this.element);
          this._addClass(this.range, "ui-slider-range");
        } else {
          this._removeClass(
            this.range,
            "ui-slider-range-min ui-slider-range-max"
          );
          this.range.css({ left: "", bottom: "" });
        }
        if (options.range === "min" || options.range === "max") {
          this._addClass(this.range, "ui-slider-range-" + options.range);
        }
      } else {
        if (this.range) {
          this.range.remove();
        }
        this.range = null;
      }
    },
    _setupEvents: function () {
      this._off(this.handles);
      this._on(this.handles, this._handleEvents);
      this._hoverable(this.handles);
      this._focusable(this.handles);
    },
    _destroy: function () {
      this.handles.remove();
      if (this.range) {
        this.range.remove();
      }
      this._mouseDestroy();
    },
    _mouseCapture: function (event) {
      var position,
        normValue,
        distance,
        closestHandle,
        index,
        allowed,
        offset,
        mouseOverHandle,
        that = this,
        o = this.options;
      if (o.disabled) {
        return false;
      }
      this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight(),
      };
      this.elementOffset = this.element.offset();
      position = { x: event.pageX, y: event.pageY };
      normValue = this._normValueFromMouse(position);
      distance = this._valueMax() - this._valueMin() + 1;
      this.handles.each(function (i) {
        var thisDistance = Math.abs(normValue - that.values(i));
        if (
          distance > thisDistance ||
          (distance === thisDistance &&
            (i === that._lastChangedValue || that.values(i) === o.min))
        ) {
          distance = thisDistance;
          closestHandle = $(this);
          index = i;
        }
      });
      allowed = this._start(event, index);
      if (allowed === false) {
        return false;
      }
      this._mouseSliding = true;
      this._handleIndex = index;
      this._addClass(closestHandle, null, "ui-state-active");
      closestHandle.trigger("focus");
      offset = closestHandle.offset();
      mouseOverHandle = !$(event.target)
        .parents()
        .addBack()
        .is(".ui-slider-handle");
      this._clickOffset = mouseOverHandle
        ? { left: 0, top: 0 }
        : {
            left: event.pageX - offset.left - closestHandle.width() / 2,
            top:
              event.pageY -
              offset.top -
              closestHandle.height() / 2 -
              (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
              (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
              (parseInt(closestHandle.css("marginTop"), 10) || 0),
          };
      if (!this.handles.hasClass("ui-state-hover")) {
        this._slide(event, index, normValue);
      }
      this._animateOff = true;
      return true;
    },
    _mouseStart: function () {
      return true;
    },
    _mouseDrag: function (event) {
      var position = { x: event.pageX, y: event.pageY },
        normValue = this._normValueFromMouse(position);
      this._slide(event, this._handleIndex, normValue);
      return false;
    },
    _mouseStop: function (event) {
      this._removeClass(this.handles, null, "ui-state-active");
      this._mouseSliding = false;
      this._stop(event, this._handleIndex);
      this._change(event, this._handleIndex);
      this._handleIndex = null;
      this._clickOffset = null;
      this._animateOff = false;
      return false;
    },
    _detectOrientation: function () {
      this.orientation =
        this.options.orientation === "vertical" ? "vertical" : "horizontal";
    },
    _normValueFromMouse: function (position) {
      var pixelTotal, pixelMouse, percentMouse, valueTotal, valueMouse;
      if (this.orientation === "horizontal") {
        pixelTotal = this.elementSize.width;
        pixelMouse =
          position.x -
          this.elementOffset.left -
          (this._clickOffset ? this._clickOffset.left : 0);
      } else {
        pixelTotal = this.elementSize.height;
        pixelMouse =
          position.y -
          this.elementOffset.top -
          (this._clickOffset ? this._clickOffset.top : 0);
      }
      percentMouse = pixelMouse / pixelTotal;
      if (percentMouse > 1) {
        percentMouse = 1;
      }
      if (percentMouse < 0) {
        percentMouse = 0;
      }
      if (this.orientation === "vertical") {
        percentMouse = 1 - percentMouse;
      }
      valueTotal = this._valueMax() - this._valueMin();
      valueMouse = this._valueMin() + percentMouse * valueTotal;
      return this._trimAlignValue(valueMouse);
    },
    _uiHash: function (index, value, values) {
      var uiHash = {
        handle: this.handles[index],
        handleIndex: index,
        value: value !== undefined ? value : this.value(),
      };
      if (this._hasMultipleValues()) {
        uiHash.value = value !== undefined ? value : this.values(index);
        uiHash.values = values || this.values();
      }
      return uiHash;
    },
    _hasMultipleValues: function () {
      return this.options.values && this.options.values.length;
    },
    _start: function (event, index) {
      return this._trigger("start", event, this._uiHash(index));
    },
    _slide: function (event, index, newVal) {
      var allowed,
        otherVal,
        currentValue = this.value(),
        newValues = this.values();
      if (this._hasMultipleValues()) {
        otherVal = this.values(index ? 0 : 1);
        currentValue = this.values(index);
        if (this.options.values.length === 2 && this.options.range === true) {
          newVal =
            index === 0
              ? Math.min(otherVal, newVal)
              : Math.max(otherVal, newVal);
        }
        newValues[index] = newVal;
      }
      if (newVal === currentValue) {
        return;
      }
      allowed = this._trigger(
        "slide",
        event,
        this._uiHash(index, newVal, newValues)
      );
      if (allowed === false) {
        return;
      }
      if (this._hasMultipleValues()) {
        this.values(index, newVal);
      } else {
        this.value(newVal);
      }
    },
    _stop: function (event, index) {
      this._trigger("stop", event, this._uiHash(index));
    },
    _change: function (event, index) {
      if (!this._keySliding && !this._mouseSliding) {
        this._lastChangedValue = index;
        this._trigger("change", event, this._uiHash(index));
      }
    },
    value: function (newValue) {
      if (arguments.length) {
        this.options.value = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, 0);
        return;
      }
      return this._value();
    },
    values: function (index, newValue) {
      var vals, newValues, i;
      if (arguments.length > 1) {
        this.options.values[index] = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, index);
        return;
      }
      if (arguments.length) {
        if ($.isArray(arguments[0])) {
          vals = this.options.values;
          newValues = arguments[0];
          for (i = 0; i < vals.length; i += 1) {
            vals[i] = this._trimAlignValue(newValues[i]);
            this._change(null, i);
          }
          this._refreshValue();
        } else {
          if (this._hasMultipleValues()) {
            return this._values(index);
          } else {
            return this.value();
          }
        }
      } else {
        return this._values();
      }
    },
    _setOption: function (key, value) {
      var i,
        valsLength = 0;
      if (key === "range" && this.options.range === true) {
        if (value === "min") {
          this.options.value = this._values(0);
          this.options.values = null;
        } else if (value === "max") {
          this.options.value = this._values(this.options.values.length - 1);
          this.options.values = null;
        }
      }
      if ($.isArray(this.options.values)) {
        valsLength = this.options.values.length;
      }
      if (key === "disabled") {
        this._toggleClass(null, "ui-state-disabled", !!value);
      }
      this._super(key, value);
      switch (key) {
        case "orientation":
          this._detectOrientation();
          this._removeClass(
            "ui-slider-horizontal ui-slider-vertical"
          )._addClass("ui-slider-" + this.orientation);
          this._refreshValue();
          if (this.options.range) {
            this._refreshRange(value);
          }
          this.handles.css(value === "horizontal" ? "bottom" : "left", "");
          break;
        case "value":
          this._animateOff = true;
          this._refreshValue();
          this._change(null, 0);
          this._animateOff = false;
          break;
        case "values":
          this._animateOff = true;
          this._refreshValue();
          for (i = valsLength - 1; i >= 0; i--) {
            this._change(null, i);
          }
          this._animateOff = false;
          break;
        case "step":
        case "min":
        case "max":
          this._animateOff = true;
          this._calculateNewMax();
          this._refreshValue();
          this._animateOff = false;
          break;
        case "range":
          this._animateOff = true;
          this._refresh();
          this._animateOff = false;
          break;
      }
    },
    _value: function () {
      var val = this.options.value;
      val = this._trimAlignValue(val);
      return val;
    },
    _values: function (index) {
      var val, vals, i;
      if (arguments.length) {
        val = this.options.values[index];
        val = this._trimAlignValue(val);
        return val;
      } else if (this._hasMultipleValues()) {
        vals = this.options.values.slice();
        for (i = 0; i < vals.length; i += 1) {
          vals[i] = this._trimAlignValue(vals[i]);
        }
        return vals;
      } else {
        return [];
      }
    },
    _trimAlignValue: function (val) {
      if (val <= this._valueMin()) {
        return this._valueMin();
      }
      if (val >= this._valueMax()) {
        return this._valueMax();
      }
      var step = this.options.step > 0 ? this.options.step : 1,
        valModStep = (val - this._valueMin()) % step,
        alignValue = val - valModStep;
      if (Math.abs(valModStep) * 2 >= step) {
        alignValue += valModStep > 0 ? step : -step;
      }
      return parseFloat(alignValue.toFixed(5));
    },
    _calculateNewMax: function () {
      var max = this.options.max,
        min = this._valueMin(),
        step = this.options.step,
        aboveMin =
          Math.floor(+(max - min).toFixed(this._precision()) / step) * step;
      max = aboveMin + min;
      this.max = parseFloat(max.toFixed(this._precision()));
    },
    _precision: function () {
      var precision = this._precisionOf(this.options.step);
      if (this.options.min !== null) {
        precision = Math.max(precision, this._precisionOf(this.options.min));
      }
      return precision;
    },
    _precisionOf: function (num) {
      var str = num.toString(),
        decimal = str.indexOf(".");
      return decimal === -1 ? 0 : str.length - decimal - 1;
    },
    _valueMin: function () {
      return this.options.min;
    },
    _valueMax: function () {
      return this.max;
    },
    _refreshRange: function (orientation) {
      if (orientation === "vertical") {
        this.range.css({ width: "", left: "" });
      }
      if (orientation === "horizontal") {
        this.range.css({ height: "", bottom: "" });
      }
    },
    _refreshValue: function () {
      var lastValPercent,
        valPercent,
        value,
        valueMin,
        valueMax,
        oRange = this.options.range,
        o = this.options,
        that = this,
        animate = !this._animateOff ? o.animate : false,
        _set = {};
      if (this._hasMultipleValues()) {
        this.handles.each(function (i) {
          valPercent =
            ((that.values(i) - that._valueMin()) /
              (that._valueMax() - that._valueMin())) *
            100;
          _set[that.orientation === "horizontal" ? "left" : "bottom"] =
            valPercent + "%";
          $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
          if (that.options.range === true) {
            if (that.orientation === "horizontal") {
              if (i === 0) {
                that.range
                  .stop(1, 1)
                  [animate ? "animate" : "css"](
                    { left: valPercent + "%" },
                    o.animate
                  );
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"](
                  { width: valPercent - lastValPercent + "%" },
                  { queue: false, duration: o.animate }
                );
              }
            } else {
              if (i === 0) {
                that.range
                  .stop(1, 1)
                  [animate ? "animate" : "css"](
                    { bottom: valPercent + "%" },
                    o.animate
                  );
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"](
                  { height: valPercent - lastValPercent + "%" },
                  { queue: false, duration: o.animate }
                );
              }
            }
          }
          lastValPercent = valPercent;
        });
      } else {
        value = this.value();
        valueMin = this._valueMin();
        valueMax = this._valueMax();
        valPercent =
          valueMax !== valueMin
            ? ((value - valueMin) / (valueMax - valueMin)) * 100
            : 0;
        _set[this.orientation === "horizontal" ? "left" : "bottom"] =
          valPercent + "%";
        this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
        if (oRange === "min" && this.orientation === "horizontal") {
          this.range
            .stop(1, 1)
            [animate ? "animate" : "css"](
              { width: valPercent + "%" },
              o.animate
            );
        }
        if (oRange === "max" && this.orientation === "horizontal") {
          this.range
            .stop(1, 1)
            [animate ? "animate" : "css"](
              { width: 100 - valPercent + "%" },
              o.animate
            );
        }
        if (oRange === "min" && this.orientation === "vertical") {
          this.range
            .stop(1, 1)
            [animate ? "animate" : "css"](
              { height: valPercent + "%" },
              o.animate
            );
        }
        if (oRange === "max" && this.orientation === "vertical") {
          this.range
            .stop(1, 1)
            [animate ? "animate" : "css"](
              { height: 100 - valPercent + "%" },
              o.animate
            );
        }
      }
    },
    _handleEvents: {
      keydown: function (event) {
        var allowed,
          curVal,
          newVal,
          step,
          index = $(event.target).data("ui-slider-handle-index");
        switch (event.keyCode) {
          case $.ui.keyCode.HOME:
          case $.ui.keyCode.END:
          case $.ui.keyCode.PAGE_UP:
          case $.ui.keyCode.PAGE_DOWN:
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            event.preventDefault();
            if (!this._keySliding) {
              this._keySliding = true;
              this._addClass($(event.target), null, "ui-state-active");
              allowed = this._start(event, index);
              if (allowed === false) {
                return;
              }
            }
            break;
        }
        step = this.options.step;
        if (this._hasMultipleValues()) {
          curVal = newVal = this.values(index);
        } else {
          curVal = newVal = this.value();
        }
        switch (event.keyCode) {
          case $.ui.keyCode.HOME:
            newVal = this._valueMin();
            break;
          case $.ui.keyCode.END:
            newVal = this._valueMax();
            break;
          case $.ui.keyCode.PAGE_UP:
            newVal = this._trimAlignValue(
              curVal + (this._valueMax() - this._valueMin()) / this.numPages
            );
            break;
          case $.ui.keyCode.PAGE_DOWN:
            newVal = this._trimAlignValue(
              curVal - (this._valueMax() - this._valueMin()) / this.numPages
            );
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
            if (curVal === this._valueMax()) {
              return;
            }
            newVal = this._trimAlignValue(curVal + step);
            break;
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            if (curVal === this._valueMin()) {
              return;
            }
            newVal = this._trimAlignValue(curVal - step);
            break;
        }
        this._slide(event, index, newVal);
      },
      keyup: function (event) {
        var index = $(event.target).data("ui-slider-handle-index");
        if (this._keySliding) {
          this._keySliding = false;
          this._stop(event, index);
          this._change(event, index);
          this._removeClass($(event.target), null, "ui-state-active");
        }
      },
    },
  });
});

/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011â€“2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {
  $.support.touch = "ontouchend" in document;
  if (!$.support.touch) {
    return;
  }
  var mouseProto = $.ui.mouse.prototype,
    _mouseInit = mouseProto._mouseInit,
    _mouseDestroy = mouseProto._mouseDestroy,
    touchHandled;
  function simulateMouseEvent(event, simulatedType) {
    if (event.originalEvent.touches.length > 1) {
      return;
    }
    event.preventDefault();
    var touch = event.originalEvent.changedTouches[0],
      simulatedEvent = document.createEvent("MouseEvents");
    simulatedEvent.initMouseEvent(
      simulatedType,
      true,
      true,
      window,
      1,
      touch.screenX,
      touch.screenY,
      touch.clientX,
      touch.clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    event.target.dispatchEvent(simulatedEvent);
  }
  mouseProto._touchStart = function (event) {
    var self = this;
    if (
      touchHandled ||
      !self._mouseCapture(event.originalEvent.changedTouches[0])
    ) {
      return;
    }
    touchHandled = true;
    self._touchMoved = false;
    simulateMouseEvent(event, "mouseover");
    simulateMouseEvent(event, "mousemove");
    simulateMouseEvent(event, "mousedown");
  };
  mouseProto._touchMove = function (event) {
    if (!touchHandled) {
      return;
    }
    this._touchMoved = true;
    simulateMouseEvent(event, "mousemove");
  };
  mouseProto._touchEnd = function (event) {
    if (!touchHandled) {
      return;
    }
    simulateMouseEvent(event, "mouseup");
    simulateMouseEvent(event, "mouseout");
    if (!this._touchMoved) {
      simulateMouseEvent(event, "click");
    }
    touchHandled = false;
  };
  mouseProto._mouseInit = function () {
    var self = this;
    self.element.bind({
      touchstart: $.proxy(self, "_touchStart"),
      touchmove: $.proxy(self, "_touchMove"),
      touchend: $.proxy(self, "_touchEnd"),
    });
    _mouseInit.call(self);
  };
  mouseProto._mouseDestroy = function () {
    var self = this;
    self.element.unbind({
      touchstart: $.proxy(self, "_touchStart"),
      touchmove: $.proxy(self, "_touchMove"),
      touchend: $.proxy(self, "_touchEnd"),
    });
    _mouseDestroy.call(self);
  };
})(jQuery);

/*!
    Colorbox 1.6.3
    license: MIT
    http://www.jacklmoore.com/colorbox
*/
(function ($, document, window) {
  var defaults = {
      html: false,
      photo: false,
      iframe: false,
      inline: false,
      transition: "elastic",
      speed: 300,
      fadeOut: 300,
      width: false,
      initialWidth: "600",
      innerWidth: false,
      maxWidth: false,
      height: false,
      initialHeight: "450",
      innerHeight: false,
      maxHeight: false,
      scalePhotos: true,
      scrolling: true,
      opacity: 0.9,
      preloading: true,
      className: false,
      overlayClose: true,
      escKey: true,
      arrowKey: true,
      top: false,
      bottom: false,
      left: false,
      right: false,
      fixed: false,
      data: undefined,
      closeButton: true,
      fastIframe: true,
      open: false,
      reposition: true,
      loop: true,
      slideshow: false,
      slideshowAuto: true,
      slideshowSpeed: 2500,
      slideshowStart: "start slideshow",
      slideshowStop: "stop slideshow",
      photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
      retinaImage: false,
      retinaUrl: false,
      retinaSuffix: "@2x.$1",
      current: "image {current} of {total}",
      previous: "previous",
      next: "next",
      close: "close",
      xhrError: "This content failed to load.",
      imgError: "This image failed to load.",
      returnFocus: true,
      trapFocus: true,
      onOpen: false,
      onLoad: false,
      onComplete: false,
      onCleanup: false,
      onClosed: false,
      rel: function () {
        return this.rel;
      },
      href: function () {
        return $(this).attr("href");
      },
      title: function () {
        return this.title;
      },
      createImg: function () {
        var img = new Image();
        var attrs = $(this).data("cbox-img-attrs");
        if (typeof attrs === "object") {
          $.each(attrs, function (key, val) {
            img[key] = val;
          });
        }
        return img;
      },
      createIframe: function () {
        var iframe = document.createElement("iframe");
        var attrs = $(this).data("cbox-iframe-attrs");
        if (typeof attrs === "object") {
          $.each(attrs, function (key, val) {
            iframe[key] = val;
          });
        }
        if ("frameBorder" in iframe) {
          iframe.frameBorder = 0;
        }
        if ("allowTransparency" in iframe) {
          iframe.allowTransparency = "true";
        }
        iframe.name = new Date().getTime();
        iframe.allowFullscreen = true;
        return iframe;
      },
    },
    colorbox = "colorbox",
    prefix = "cbox",
    boxElement = prefix + "Element",
    event_open = prefix + "_open",
    event_load = prefix + "_load",
    event_complete = prefix + "_complete",
    event_cleanup = prefix + "_cleanup",
    event_closed = prefix + "_closed",
    event_purge = prefix + "_purge",
    $overlay,
    $box,
    $wrap,
    $content,
    $topBorder,
    $leftBorder,
    $rightBorder,
    $bottomBorder,
    $related,
    $window,
    $loaded,
    $loadingBay,
    $loadingOverlay,
    $title,
    $current,
    $slideshow,
    $next,
    $prev,
    $close,
    $groupControls,
    $events = $("<a/>"),
    settings,
    interfaceHeight,
    interfaceWidth,
    loadedHeight,
    loadedWidth,
    index,
    photo,
    open,
    active,
    closing,
    loadingTimer,
    publicMethod,
    div = "div",
    requests = 0,
    previousCSS = {},
    init;
  function $tag(tag, id, css) {
    var element = document.createElement(tag);
    if (id) {
      element.id = prefix + id;
    }
    if (css) {
      element.style.cssText = css;
    }
    return $(element);
  }
  function winheight() {
    return window.innerHeight ? window.innerHeight : $(window).height();
  }
  function Settings(element, options) {
    if (options !== Object(options)) {
      options = {};
    }
    this.cache = {};
    this.el = element;
    this.value = function (key) {
      var dataAttr;
      if (this.cache[key] === undefined) {
        dataAttr = $(this.el).attr("data-cbox-" + key);
        if (dataAttr !== undefined) {
          this.cache[key] = dataAttr;
        } else if (options[key] !== undefined) {
          this.cache[key] = options[key];
        } else if (defaults[key] !== undefined) {
          this.cache[key] = defaults[key];
        }
      }
      return this.cache[key];
    };
    this.get = function (key) {
      var value = this.value(key);
      return $.isFunction(value) ? value.call(this.el, this) : value;
    };
  }
  function getIndex(increment) {
    var max = $related.length,
      newIndex = (index + increment) % max;
    return newIndex < 0 ? max + newIndex : newIndex;
  }
  function setSize(size, dimension) {
    return Math.round(
      (/%/.test(size)
        ? (dimension === "x" ? $window.width() : winheight()) / 100
        : 1) * parseInt(size, 10)
    );
  }
  function isImage(settings, url) {
    return settings.get("photo") || settings.get("photoRegex").test(url);
  }
  function retinaUrl(settings, url) {
    return settings.get("retinaUrl") && window.devicePixelRatio > 1
      ? url.replace(settings.get("photoRegex"), settings.get("retinaSuffix"))
      : url;
  }
  function trapFocus(e) {
    if (
      "contains" in $box[0] &&
      !$box[0].contains(e.target) &&
      e.target !== $overlay[0]
    ) {
      e.stopPropagation();
      $box.focus();
    }
  }
  function setClass(str) {
    if (setClass.str !== str) {
      $box.add($overlay).removeClass(setClass.str).addClass(str);
      setClass.str = str;
    }
  }
  function getRelated(rel) {
    index = 0;
    if (rel && rel !== false && rel !== "nofollow") {
      $related = $("." + boxElement).filter(function () {
        var options = $.data(this, colorbox);
        var settings = new Settings(this, options);
        return settings.get("rel") === rel;
      });
      index = $related.index(settings.el);
      if (index === -1) {
        $related = $related.add(settings.el);
        index = $related.length - 1;
      }
    } else {
      $related = $(settings.el);
    }
  }
  function trigger(event) {
    $(document).trigger(event);
    $events.triggerHandler(event);
  }
  var slideshow = (function () {
    var active,
      className = prefix + "Slideshow_",
      click = "click." + prefix,
      timeOut;
    function clear() {
      clearTimeout(timeOut);
    }
    function set() {
      if (settings.get("loop") || $related[index + 1]) {
        clear();
        timeOut = setTimeout(publicMethod.next, settings.get("slideshowSpeed"));
      }
    }
    function start() {
      $slideshow
        .html(settings.get("slideshowStop"))
        .unbind(click)
        .one(click, stop);
      $events.bind(event_complete, set).bind(event_load, clear);
      $box.removeClass(className + "off").addClass(className + "on");
    }
    function stop() {
      clear();
      $events.unbind(event_complete, set).unbind(event_load, clear);
      $slideshow
        .html(settings.get("slideshowStart"))
        .unbind(click)
        .one(click, function () {
          publicMethod.next();
          start();
        });
      $box.removeClass(className + "on").addClass(className + "off");
    }
    function reset() {
      active = false;
      $slideshow.hide();
      clear();
      $events.unbind(event_complete, set).unbind(event_load, clear);
      $box.removeClass(className + "off " + className + "on");
    }
    return function () {
      if (active) {
        if (!settings.get("slideshow")) {
          $events.unbind(event_cleanup, reset);
          reset();
        }
      } else {
        if (settings.get("slideshow") && $related[1]) {
          active = true;
          $events.one(event_cleanup, reset);
          if (settings.get("slideshowAuto")) {
            start();
          } else {
            stop();
          }
          $slideshow.show();
        }
      }
    };
  })();
  function launch(element) {
    var options;
    if (!closing) {
      options = $(element).data(colorbox);
      settings = new Settings(element, options);
      getRelated(settings.get("rel"));
      if (!open) {
        open = active = true;
        setClass(settings.get("className"));
        $box.css({ visibility: "hidden", display: "block", opacity: "" });
        $loaded = $tag(
          div,
          "LoadedContent",
          "width:0; height:0; overflow:hidden; visibility:hidden"
        );
        $content.css({ width: "", height: "" }).append($loaded);
        interfaceHeight =
          $topBorder.height() +
          $bottomBorder.height() +
          $content.outerHeight(true) -
          $content.height();
        interfaceWidth =
          $leftBorder.width() +
          $rightBorder.width() +
          $content.outerWidth(true) -
          $content.width();
        loadedHeight = $loaded.outerHeight(true);
        loadedWidth = $loaded.outerWidth(true);
        var initialWidth = setSize(settings.get("initialWidth"), "x");
        var initialHeight = setSize(settings.get("initialHeight"), "y");
        var maxWidth = settings.get("maxWidth");
        var maxHeight = settings.get("maxHeight");
        settings.w = Math.max(
          (maxWidth !== false
            ? Math.min(initialWidth, setSize(maxWidth, "x"))
            : initialWidth) -
            loadedWidth -
            interfaceWidth,
          0
        );
        settings.h = Math.max(
          (maxHeight !== false
            ? Math.min(initialHeight, setSize(maxHeight, "y"))
            : initialHeight) -
            loadedHeight -
            interfaceHeight,
          0
        );
        $loaded.css({ width: "", height: settings.h });
        publicMethod.position();
        trigger(event_open);
        settings.get("onOpen");
        $groupControls.add($title).hide();
        $box.focus();
        if (settings.get("trapFocus")) {
          if (document.addEventListener) {
            document.addEventListener("focus", trapFocus, true);
            $events.one(event_closed, function () {
              document.removeEventListener("focus", trapFocus, true);
            });
          }
        }
        if (settings.get("returnFocus")) {
          $events.one(event_closed, function () {
            $(settings.el).focus();
          });
        }
      }
      var opacity = parseFloat(settings.get("opacity"));
      $overlay
        .css({
          opacity: opacity === opacity ? opacity : "",
          cursor: settings.get("overlayClose") ? "pointer" : "",
          visibility: "visible",
        })
        .show();
      if (settings.get("closeButton")) {
        $close.html(settings.get("close")).appendTo($content);
      } else {
        $close.appendTo("<div/>");
      }
      load();
    }
  }
  function appendHTML() {
    if (!$box) {
      init = false;
      $window = $(window);
      $box = $tag(div)
        .attr({
          id: colorbox,
          class: $.support.opacity === false ? prefix + "IE" : "",
          role: "dialog",
          tabindex: "-1",
        })
        .hide();
      $overlay = $tag(div, "Overlay").hide();
      $loadingOverlay = $([
        $tag(div, "LoadingOverlay")[0],
        $tag(div, "LoadingGraphic")[0],
      ]);
      $wrap = $tag(div, "Wrapper");
      $content = $tag(div, "Content").append(
        ($title = $tag(div, "Title")),
        ($current = $tag(div, "Current")),
        ($prev = $('<button type="button"/>').attr({
          id: prefix + "Previous",
        })),
        ($next = $('<button type="button"/>').attr({ id: prefix + "Next" })),
        ($slideshow = $tag("button", "Slideshow")),
        $loadingOverlay
      );
      $close = $('<button type="button"/>').attr({ id: prefix + "Close" });
      $wrap
        .append(
          $tag(div).append(
            $tag(div, "TopLeft"),
            ($topBorder = $tag(div, "TopCenter")),
            $tag(div, "TopRight")
          ),
          $tag(div, false, "clear:left").append(
            ($leftBorder = $tag(div, "MiddleLeft")),
            $content,
            ($rightBorder = $tag(div, "MiddleRight"))
          ),
          $tag(div, false, "clear:left").append(
            $tag(div, "BottomLeft"),
            ($bottomBorder = $tag(div, "BottomCenter")),
            $tag(div, "BottomRight")
          )
        )
        .find("div div")
        .css({ float: "left" });
      $loadingBay = $tag(
        div,
        false,
        "position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"
      );
      $groupControls = $next.add($prev).add($current).add($slideshow);
    }
    if (document.body && !$box.parent().length) {
      $(document.body).append($overlay, $box.append($wrap, $loadingBay));
    }
  }
  function addBindings() {
    function clickHandler(e) {
      if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        launch(this);
      }
    }
    if ($box) {
      if (!init) {
        init = true;
        $next.click(function () {
          publicMethod.next();
        });
        $prev.click(function () {
          publicMethod.prev();
        });
        $close.click(function () {
          publicMethod.close();
        });
        $overlay.click(function () {
          if (settings.get("overlayClose")) {
            publicMethod.close();
          }
        });
        $(document).bind("keydown." + prefix, function (e) {
          var key = e.keyCode;
          if (open && settings.get("escKey") && key === 27) {
            e.preventDefault();
            publicMethod.close();
          }
          if (open && settings.get("arrowKey") && $related[1] && !e.altKey) {
            if (key === 37) {
              e.preventDefault();
              $prev.click();
            } else if (key === 39) {
              e.preventDefault();
              $next.click();
            }
          }
        });
        if ($.isFunction($.fn.on)) {
          $(document).on("click." + prefix, "." + boxElement, clickHandler);
        } else {
          $("." + boxElement).live("click." + prefix, clickHandler);
        }
      }
      return true;
    }
    return false;
  }
  if ($[colorbox]) {
    return;
  }
  $(appendHTML);
  publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
    var settings;
    var $obj = this;
    options = options || {};
    if ($.isFunction($obj)) {
      $obj = $("<a/>");
      options.open = true;
    }
    if (!$obj[0]) {
      return $obj;
    }
    appendHTML();
    if (addBindings()) {
      if (callback) {
        options.onComplete = callback;
      }
      $obj
        .each(function () {
          var old = $.data(this, colorbox) || {};
          $.data(this, colorbox, $.extend(old, options));
        })
        .addClass(boxElement);
      settings = new Settings($obj[0], options);
      if (settings.get("open")) {
        launch($obj[0]);
      }
    }
    return $obj;
  };
  publicMethod.position = function (speed, loadedCallback) {
    var css,
      top = 0,
      left = 0,
      offset = $box.offset(),
      scrollTop,
      scrollLeft;
    $window.unbind("resize." + prefix);
    $box.css({ top: -9e4, left: -9e4 });
    scrollTop = $window.scrollTop();
    scrollLeft = $window.scrollLeft();
    if (settings.get("fixed")) {
      offset.top -= scrollTop;
      offset.left -= scrollLeft;
      $box.css({ position: "fixed" });
    } else {
      top = scrollTop;
      left = scrollLeft;
      $box.css({ position: "absolute" });
    }
    if (settings.get("right") !== false) {
      left += Math.max(
        $window.width() -
          settings.w -
          loadedWidth -
          interfaceWidth -
          setSize(settings.get("right"), "x"),
        0
      );
    } else if (settings.get("left") !== false) {
      left += setSize(settings.get("left"), "x");
    } else {
      left += Math.round(
        Math.max(
          $window.width() - settings.w - loadedWidth - interfaceWidth,
          0
        ) / 2
      );
    }
    if (settings.get("bottom") !== false) {
      top += Math.max(
        winheight() -
          settings.h -
          loadedHeight -
          interfaceHeight -
          setSize(settings.get("bottom"), "y"),
        0
      );
    } else if (settings.get("top") !== false) {
      top += setSize(settings.get("top"), "y");
    } else {
      top += Math.round(
        Math.max(winheight() - settings.h - loadedHeight - interfaceHeight, 0) /
          2
      );
    }
    $box.css({ top: offset.top, left: offset.left, visibility: "visible" });
    $wrap[0].style.width = $wrap[0].style.height = "9999px";
    function modalDimensions() {
      $topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width =
        parseInt($box[0].style.width, 10) - interfaceWidth + "px";
      $content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height =
        parseInt($box[0].style.height, 10) - interfaceHeight + "px";
    }
    css = {
      width: settings.w + loadedWidth + interfaceWidth,
      height: settings.h + loadedHeight + interfaceHeight,
      top: top,
      left: left,
    };
    if (speed) {
      var tempSpeed = 0;
      $.each(css, function (i) {
        if (css[i] !== previousCSS[i]) {
          tempSpeed = speed;
          return;
        }
      });
      speed = tempSpeed;
    }
    previousCSS = css;
    if (!speed) {
      $box.css(css);
    }
    $box.dequeue().animate(css, {
      duration: speed || 0,
      complete: function () {
        modalDimensions();
        active = false;
        $wrap[0].style.width = settings.w + loadedWidth + interfaceWidth + "px";
        $wrap[0].style.height =
          settings.h + loadedHeight + interfaceHeight + "px";
        if (settings.get("reposition")) {
          setTimeout(function () {
            $window.bind("resize." + prefix, publicMethod.position);
          }, 1);
        }
        if ($.isFunction(loadedCallback)) {
          loadedCallback();
        }
      },
      step: modalDimensions,
    });
  };
  publicMethod.resize = function (options) {
    var scrolltop;
    if (open) {
      options = options || {};
      if (options.width) {
        settings.w = setSize(options.width, "x") - loadedWidth - interfaceWidth;
      }
      if (options.innerWidth) {
        settings.w = setSize(options.innerWidth, "x");
      }
      $loaded.css({ width: settings.w });
      if (options.height) {
        settings.h =
          setSize(options.height, "y") - loadedHeight - interfaceHeight;
      }
      if (options.innerHeight) {
        settings.h = setSize(options.innerHeight, "y");
      }
      if (!options.innerHeight && !options.height) {
        scrolltop = $loaded.scrollTop();
        $loaded.css({ height: "auto" });
        settings.h = $loaded.height();
      }
      $loaded.css({ height: settings.h });
      if (scrolltop) {
        $loaded.scrollTop(scrolltop);
      }
      publicMethod.position(
        settings.get("transition") === "none" ? 0 : settings.get("speed")
      );
    }
  };
  publicMethod.prep = function (object) {
    if (!open) {
      return;
    }
    var callback,
      speed = settings.get("transition") === "none" ? 0 : settings.get("speed");
    $loaded.remove();
    $loaded = $tag(div, "LoadedContent").append(object);
    function getWidth() {
      settings.w = settings.w || $loaded.width();
      settings.w =
        settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
      return settings.w;
    }
    function getHeight() {
      settings.h = settings.h || $loaded.height();
      settings.h =
        settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
      return settings.h;
    }
    $loaded
      .hide()
      .appendTo($loadingBay.show())
      .css({
        width: getWidth(),
        overflow: settings.get("scrolling") ? "auto" : "hidden",
      })
      .css({ height: getHeight() })
      .prependTo($content);
    $loadingBay.hide();
    $(photo).css({ float: "none" });
    setClass(settings.get("className"));
    callback = function () {
      var total = $related.length,
        iframe,
        complete;
      if (!open) {
        return;
      }
      function removeFilter() {
        if ($.support.opacity === false) {
          $box[0].style.removeAttribute("filter");
        }
      }
      complete = function () {
        clearTimeout(loadingTimer);
        $loadingOverlay.hide();
        trigger(event_complete);
        settings.get("onComplete");
      };
      $title.html(settings.get("title")).show();
      $loaded.show();
      if (total > 1) {
        if (typeof settings.get("current") === "string") {
          $current
            .html(
              settings
                .get("current")
                .replace("{current}", index + 1)
                .replace("{total}", total)
            )
            .show();
        }
        $next[
          settings.get("loop") || index < total - 1 ? "show" : "hide"
        ]().html(settings.get("next"));
        $prev[settings.get("loop") || index ? "show" : "hide"]().html(
          settings.get("previous")
        );
        slideshow();
        if (settings.get("preloading")) {
          $.each([getIndex(-1), getIndex(1)], function () {
            var img,
              i = $related[this],
              settings = new Settings(i, $.data(i, colorbox)),
              src = settings.get("href");
            if (src && isImage(settings, src)) {
              src = retinaUrl(settings, src);
              img = document.createElement("img");
              img.src = src;
            }
          });
        }
      } else {
        $groupControls.hide();
      }
      if (settings.get("iframe")) {
        iframe = settings.get("createIframe");
        if (!settings.get("scrolling")) {
          iframe.scrolling = "no";
        }
        $(iframe)
          .attr({ src: settings.get("href"), class: prefix + "Iframe" })
          .one("load", complete)
          .appendTo($loaded);
        $events.one(event_purge, function () {
          iframe.src = "//about:blank";
        });
        if (settings.get("fastIframe")) {
          $(iframe).trigger("load");
        }
      } else {
        complete();
      }
      if (settings.get("transition") === "fade") {
        $box.fadeTo(speed, 1, removeFilter);
      } else {
        removeFilter();
      }
    };
    if (settings.get("transition") === "fade") {
      $box.fadeTo(speed, 0, function () {
        publicMethod.position(0, callback);
      });
    } else {
      publicMethod.position(speed, callback);
    }
  };
  function load() {
    var href,
      setResize,
      prep = publicMethod.prep,
      $inline,
      request = ++requests;
    active = true;
    photo = false;
    trigger(event_purge);
    trigger(event_load);
    settings.get("onLoad");
    settings.h = settings.get("height")
      ? setSize(settings.get("height"), "y") - loadedHeight - interfaceHeight
      : settings.get("innerHeight") &&
        setSize(settings.get("innerHeight"), "y");
    settings.w = settings.get("width")
      ? setSize(settings.get("width"), "x") - loadedWidth - interfaceWidth
      : settings.get("innerWidth") && setSize(settings.get("innerWidth"), "x");
    settings.mw = settings.w;
    settings.mh = settings.h;
    if (settings.get("maxWidth")) {
      settings.mw =
        setSize(settings.get("maxWidth"), "x") - loadedWidth - interfaceWidth;
      settings.mw =
        settings.w && settings.w < settings.mw ? settings.w : settings.mw;
    }
    if (settings.get("maxHeight")) {
      settings.mh =
        setSize(settings.get("maxHeight"), "y") -
        loadedHeight -
        interfaceHeight;
      settings.mh =
        settings.h && settings.h < settings.mh ? settings.h : settings.mh;
    }
    href = settings.get("href");
    loadingTimer = setTimeout(function () {
      $loadingOverlay.show();
    }, 100);
    if (settings.get("inline")) {
      var $target = $(href);
      $inline = $("<div>").hide().insertBefore($target);
      $events.one(event_purge, function () {
        $inline.replaceWith($target);
      });
      prep($target);
    } else if (settings.get("iframe")) {
      prep(" ");
    } else if (settings.get("html")) {
      prep(settings.get("html"));
    } else if (isImage(settings, href)) {
      href = retinaUrl(settings, href);
      photo = settings.get("createImg");
      $(photo)
        .addClass(prefix + "Photo")
        .bind("error." + prefix, function () {
          prep($tag(div, "Error").html(settings.get("imgError")));
        })
        .one("load", function () {
          if (request !== requests) {
            return;
          }
          setTimeout(function () {
            var percent;
            if (settings.get("retinaImage") && window.devicePixelRatio > 1) {
              photo.height = photo.height / window.devicePixelRatio;
              photo.width = photo.width / window.devicePixelRatio;
            }
            if (settings.get("scalePhotos")) {
              setResize = function () {
                photo.height -= photo.height * percent;
                photo.width -= photo.width * percent;
              };
              if (settings.mw && photo.width > settings.mw) {
                percent = (photo.width - settings.mw) / photo.width;
                setResize();
              }
              if (settings.mh && photo.height > settings.mh) {
                percent = (photo.height - settings.mh) / photo.height;
                setResize();
              }
            }
            if (settings.h) {
              photo.style.marginTop =
                Math.max(settings.mh - photo.height, 0) / 2 + "px";
            }
            if ($related[1] && (settings.get("loop") || $related[index + 1])) {
              photo.style.cursor = "pointer";
              $(photo).bind("click." + prefix, function () {
                publicMethod.next();
              });
            }
            photo.style.width = photo.width + "px";
            photo.style.height = photo.height + "px";
            prep(photo);
          }, 1);
        });
      photo.src = href;
    } else if (href) {
      $.ajaxSetup({ headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" } });
      $loadingBay.load(href, settings.get("data"), function (data, status) {
        if (request === requests) {
          prep(
            status === "error"
              ? $tag(div, "Error").html(settings.get("xhrError"))
              : $(this).contents()
          );
        }
      });
      delete $.ajaxSettings.headers["X-Shoptet-XHR"];
    }
  }
  publicMethod.next = function () {
    if (
      !active &&
      $related[1] &&
      (settings.get("loop") || $related[index + 1])
    ) {
      index = getIndex(1);
      launch($related[index]);
    }
  };
  publicMethod.prev = function () {
    if (!active && $related[1] && (settings.get("loop") || index)) {
      index = getIndex(-1);
      launch($related[index]);
    }
  };
  publicMethod.close = function () {
    if (open && !closing) {
      closing = true;
      open = false;
      trigger(event_cleanup);
      settings.get("onCleanup");
      $window.unbind("." + prefix);
      $overlay.fadeTo(settings.get("fadeOut") || 0, 0);
      $box.stop().fadeTo(settings.get("fadeOut") || 0, 0, function () {
        $box.hide();
        $overlay.hide();
        trigger(event_purge);
        $loaded.remove();
        setTimeout(function () {
          closing = false;
          trigger(event_closed);
          settings.get("onClosed");
        }, 1);
      });
    }
  };
  publicMethod.remove = function () {
    if (!$box) {
      return;
    }
    $box.stop();
    $[colorbox].close();
    $box.stop(false, true).remove();
    $overlay.remove();
    closing = false;
    $box = null;
    $("." + boxElement)
      .removeData(colorbox)
      .removeClass(boxElement);
    $(document)
      .unbind("click." + prefix)
      .unbind("keydown." + prefix);
  };
  publicMethod.element = function () {
    return $(settings.el);
  };
  publicMethod.settings = defaults;
})(jQuery, document, window);

(function (shoptet) {
  function applyFunction(fn, args) {
    var namespace = "";
    if (typeof fn.prototype.shoptetNamespace !== "undefined") {
      namespace = fn.prototype.shoptetNamespace;
    }
    if (typeof args !== "object") {
      args = [];
    }
    try {
      handleFunctionCall(fn, args, namespace);
      var returnValue = fn.apply(null, args);
      handleFunctionCallback(fn, args, namespace);
      return returnValue;
    } catch (e) {
      console.log(
        "%cFunction " + namespace + fn.name + " was not applied.",
        shoptet.dev.config.log.styles.error
      );
      console.log("%cException:", shoptet.dev.config.log.styles.error);
      console.log(e);
    }
  }
  function handleFunctionCall(fn, args, namespace) {
    var event = new CustomEvent(namespace + fn.name);
    shoptet.scripts.arguments[namespace + fn.name] = args;
    document.dispatchEvent(event);
  }
  function handleFunctionCallback(fn, args, namespace) {
    var fnToApply = shoptet.scripts.customCallbacks[namespace + fn.name];
    if (typeof fnToApply === "function") {
      fnToApply(args);
    }
  }
  function setCustomCallback(fnName, customCallback) {
    var fn = eval(fnName);
    if (typeof fn === "function" && typeof customCallback === "function") {
      var previousCallback = function () {};
      if (typeof shoptet.scripts.customCallbacks[fnName] === "function") {
        previousCallback = shoptet.scripts.customCallbacks[fnName];
      }
      shoptet.scripts.customCallbacks[fnName] = function (args) {
        previousCallback(args);
        customCallback(args);
      };
    }
  }
  function signal(event, element, eventSource, globalEvent) {
    if (typeof element === "undefined" || !element) {
      element = document;
    }
    try {
      if (eventSource === null || eventSource.indexOf(event) !== -1) {
        var ev;
        if (globalEvent) {
          ev = new CustomEvent(globalEvent, { bubbles: true });
          element.dispatchEvent(ev);
        }
        ev = new CustomEvent(event, { bubbles: true });
        element.dispatchEvent(ev);
        if (shoptet.dev.config.monitorEvents) {
          if (globalEvent) {
            console.log(
              '%cEvent "' + globalEvent + '" was dispatched.',
              shoptet.dev.config.log.styles.success
            );
          }
          console.log(
            '%cEvent "' + event + '" was dispatched.',
            shoptet.dev.config.log.styles.success
          );
          console.log(
            "%cElement on which the event was dispatched: ",
            shoptet.dev.config.log.styles.success
          );
          console.log(element);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.log(
        '%cEvent "' + event + '" was not dispatched.',
        shoptet.dev.config.log.styles.error
      );
      console.log(
        "%cElement on which the event should be dispatched: ",
        shoptet.dev.config.log.styles.error
      );
      console.log(element);
      console.log("%cException:", shoptet.dev.config.log.styles.error);
      console.log(e);
    }
  }
  function signalDomLoad(event, element) {
    signal(
      event,
      element,
      shoptet.scripts.availableDOMLoadEvents,
      "ShoptetDOMContentLoaded"
    );
  }
  function signalDomUpdate(event, element) {
    signal(
      event,
      element,
      shoptet.scripts.availableDOMUpdateEvents,
      "ShoptetDOMContentChanged"
    );
  }
  function signalCustomEvent(event, element) {
    signal(event, element, shoptet.scripts.availableCustomEvents, false);
  }
  function signalNativeEvent(event, element) {
    signal(event, element, null, false);
  }
  if (!function f() {}.name) {
    Object.defineProperty(Function.prototype, "name", {
      get: function () {
        var name = (this.toString().match(/^function\s*([^\s(]+)/) || [])[1];
        Object.defineProperty(this, "name", { value: name });
        return name;
      },
    });
  }
  function registerFunction(fn, lib) {
    fn.prototype.shoptetNamespace = "shoptet." + lib + ".";
    shoptet[lib][fn.name] = function () {
      return shoptet.scripts.applyFunction(fn, arguments);
    };
  }
  shoptet.scripts = shoptet.scripts || {};
  shoptet.scripts.arguments = {};
  shoptet.scripts.monitoredFunctions = [];
  shoptet.scripts.availableDOMLoadEvents = [
    "ShoptetDOMContentLoaded",
    "ShoptetDOMRegisterFormLoaded",
    "ShoptetDOMCartContentLoaded",
    "ShoptetDOMAdvancedOrderLoaded",
    "ShoptetDOMPageContentLoaded",
    "ShoptetDOMPageMoreProductsLoaded",
  ];
  shoptet.scripts.availableDOMUpdateEvents = ["ShoptetDOMCartCountUpdated"];
  shoptet.scripts.availableCustomEvents = [
    "ShoptetPhoneCodeChange",
    "ShoptetPhoneCodeActive",
    "ShoptetBillZipPatternChange",
    "ShoptetDeliveryZipPatternChange",
    "ShoptetCompanyIdPatternChange",
    "ShoptetSelectedParametersReset",
    "ShoptetSplitVariantParameterChange",
    "ShoptetSimpleVariantChange",
    "ShoptetVariantAvailable",
    "ShoptetVariantUnavailable",
    "ShoptetCartSetCartItemAmount",
    "ShoptetCartAddCartItem",
    "ShoptetCartAddCartItemFailed",
    "ShoptetCartDeleteCartItem",
    "ShoptetCartSetSelectedGift",
    "ShoptetCartAddDiscountCoupon",
    "ShoptetCartUpdated",
    "validatedFormSubmit",
    "ShoptetPagePaginationUsed",
    "ShoptetPageSortingChanged",
    "ShoptetPageFiltersRecalledFromHistory",
    "ShoptetPagePriceFilterChange",
    "ShoptetPageFilterValueChange",
    "ShoptetPageFiltersCleared",
    "ShoptetPageMoreProductsRequested",
    "ShoptetSuccessfulValidation",
    "ShoptetFailedValidation",
    "ShoptetProductsTracked",
    "ShoptetFacebookPixelTracked",
    "ShoptetGoogleCartTracked",
    "ShoptetDataLayerUpdated",
    "ShoptetValidationTransform",
    "ShoptetValidationWarning",
    "ShoptetValidationError",
  ];
  shoptet.scripts.libs = {
    cart: [
      "updateCartButton",
      "getCartContent",
      "getAdvancedOrder",
      "functionsForCart",
      "functionsForStep1",
      "handleCartPostUpdate",
      "ajaxSubmitForm",
      "updateQuantityInCart",
      "removeItemFromCart",
      "toggleRelatedProducts",
    ],
    cartShared: ["addToCart"],
    cookie: ["get", "create"],
    checkout: [
      "changePaymentRelations",
      "callShippingBillingRelations",
      "replacingChosenShippingAndBilling",
      "revealMatrixPrice",
      "displaySelectedPriceByShippingBillingMethods",
      "checkFirstPossibleBillingMethod",
      "setFirstPossibleShippingAndBilling",
      "setActiveShippingAndPayments",
      "checkIsSelectedActive",
      "payu",
      "gopaySelectHelper",
      "getStatedValues",
      "setFieldValues",
      "toggleAnotherShipping",
      "modalMagic",
      "chooseABranchModal",
      "compareHeight",
      "fixSidebar",
      "handleWithSidebar",
      "setupDeliveryShipping",
      "displayApplePay",
    ],
    validator: [
      "initNewValidator",
      "formContainsInvalidFields",
      "handleValidators",
      "getExistingMessage",
      "removeErrorMessage",
      "addErrorMessage",
    ],
    validatorRequired: ["validateRequiredField"],
    validatorPhone: ["validateNumber"],
    validatorZipCode: ["validateZipCode", "updateZipValidPattern"],
    validatorCompanyId: ["validateCompanyId", "updateCompanyIdValidPattern"],
    global: [
      "showPopupWindow",
      "hideContentWindows",
      "updateSelectedRegions",
      "toggleRegionsWrapper",
      "restoreDefaultRegionSelect",
    ],
    helpers: [
      "toFloat",
      "toLocaleFloat",
      "resolveDecimalSeparator",
      "resolveThousandSeparator",
      "resolveDecimalPlaces",
      "resolveCurrencySymbol",
      "resolveCurrencySymbolPosition",
      "formatNumber",
      "formatAsCurrency",
      "resolveMinimumAmount",
      "updateQuantity",
      "isTouchDevice",
    ],
    products: [
      "splitWidgetParameters",
      "splitSingleWidgetParameter",
      "replaceImage",
      "highlightActiveThumbnail",
      "browseProducts",
      "setThumbnailsDirection",
      "setThumbnails",
      "checkThumbnailsAction",
      "checkThumbnails",
      "switchThumbnails",
      "checkDiscountFlag",
      "changeStyle",
      "setStyle",
      "returnStyle",
      "sameHeightOfProductsLoop",
      "setHeightOfBigProduct",
      "sameHeightOfProducts",
    ],
    menu: [
      "toggleMenu",
      "splitMenu",
      "splitHelperMenu",
      "showMenuHelper",
      "hideMenuHelper",
      "showSubmenu",
      "hideSubmenu",
      "updateMenu",
      "hideNavigation",
    ],
    variantsCommon: [
      "disableAddingToCart",
      "enableAddingToCart",
      "hasToDisableCartButton",
      "handleSubmit",
      "handleBrowserValueRestoration",
    ],
    variantsSimple: ["handler", "switcher"],
    variantsSplit: ["handler", "getData", "showVariantDependent"],
    surcharges: [
      "initSurcharges",
      "updatePrices",
      "getSurchargePrices",
      "writePrices",
    ],
    variantsUnavailable: [
      "setupAllParameters",
      "attachEventListeners",
      "getAvailableCombinations",
      "getSelected",
      "getExistingOptions",
      "getUnavailableOptgroup",
      "handleOptions",
      "getOption",
      "moveOptionFromUnavailable",
      "areUnavailableOptionsSelected",
      "setupCurrentParameter",
      "sortOptions",
    ],
    phoneInput: [
      "handleFlags",
      "interconnectFlagsWithSelect",
      "hideCountriesSelect",
      "setSelectedCountry",
      "setLastPreferredCountry",
      "handleKeyCodes",
      "selectSelectedOption",
      "positionCountriesSelect",
    ],
    common: [
      "getSelectValue",
      "getCheckedInputValue",
      "createDocumentFromString",
      "serializeData",
      "serializeForm",
      "createEventNameFromFormAction",
      "fitsToParentWidth",
      "addClassToElements",
      "removeClassFromElements",
    ],
    stockAvailabilities: [
      "getDeliveryPointName",
      "getDeliveryPointAmount",
      "getStockAvailabilities",
      "setStockAvailabilities",
      "attachEventListeners",
      "mouseEnterListener",
      "mouseLeaveListener",
    ],
    cofidis: [
      "getElements",
      "setMinPayment",
      "calculator",
      "handleClick",
      "addCalculatorListeners",
    ],
    tracking: [
      "getFormAction",
      "resolveUpdateAction",
      "resolveAmount",
      "resolveTrackingAction",
      "handleAction",
      "trackProducts",
      "trackFacebookPixel",
      "trackGoogleCart",
      "updateDataLayer",
      "handlePromoClick",
      "trackProductsFromPayload",
      "updateDataLayerCartInfo",
    ],
    runtime: ["resizeEnd"],
    modal: ["open", "close", "resize", "shoptetResize"],
  };
  for (var key in shoptet.scripts.libs) {
    if (shoptet.scripts.libs.hasOwnProperty(key)) {
      for (var i = 0; i < shoptet.scripts.libs[key].length; i++) {
        shoptet.scripts.monitoredFunctions.push(
          "shoptet." + key + "." + shoptet.scripts.libs[key][i]
        );
      }
    }
  }
  shoptet.scripts.applyFunction = applyFunction;
  shoptet.scripts.handleFunctionCall = handleFunctionCall;
  shoptet.scripts.handleFunctionCallback = handleFunctionCallback;
  shoptet.scripts.setCustomCallback = setCustomCallback;
  shoptet.scripts.signal = signal;
  shoptet.scripts.signalDomLoad = signalDomLoad;
  shoptet.scripts.signalDomUpdate = signalDomUpdate;
  shoptet.scripts.signalCustomEvent = signalCustomEvent;
  shoptet.scripts.signalNativeEvent = signalNativeEvent;
  shoptet.scripts.registerFunction = registerFunction;
  shoptet.scripts.customCallbacks = {};
})(shoptet);

(function (shoptet) {
  function enableEventsMonitoring() {
    shoptet.dev.config.monitorEvents = true;
    console.log(
      "%cEvents monitoring enabled.",
      shoptet.dev.config.log.styles.success
    );
    return true;
  }
  function disableEventsMonitoring() {
    shoptet.dev.config.monitorEvents = false;
    console.log(
      "%cEvents monitoring disabled.",
      shoptet.dev.config.log.styles.error
    );
    return true;
  }
  function printMonitoringInfo() {
    console.log(
      "%c" + shoptet.dev.config.name + " version " + shoptet.dev.config.version,
      shoptet.dev.config.log.styles.infoInv
    );
    if (shoptet.dev.config.monitorEvents) {
      console.log(
        "%cEvents monitoring is enabled.",
        shoptet.dev.config.log.styles.success
      );
      console.log(
        "To disable events monitoring, run %cshoptet.dev.disableEventsMonitoring()",
        shoptet.dev.config.log.styles.shell
      );
    } else {
      console.log(
        "%cEvents monitoring is disabled.",
        shoptet.dev.config.log.styles.error
      );
      console.log(
        "To enable events monitoring, run %cshoptet.dev.enableEventsMonitoring()",
        shoptet.dev.config.log.styles.shell
      );
    }
  }
  function printEventInfo(key) {
    console.log(
      "%cApplied function name:%c " + key,
      shoptet.dev.config.log.styles.infoInv,
      shoptet.dev.config.log.styles.fontLarger
    );
    console.log("%cPassed arguments:", shoptet.dev.config.log.styles.infoInv);
    console.log(shoptet.scripts.arguments[key]);
  }
  function attachEventInfo(event) {
    if (shoptet.dev.config.monitorEvents) {
      shoptet.dev.printEventInfo(event.type);
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (!shoptet.abilities || shoptet.abilities.about.generation !== 3) {
      return false;
    }
    printMonitoringInfo();
    shoptet.scripts.monitoredFunctions.forEach(function (key) {
      (function (key) {
        document.addEventListener(key, shoptet.dev.attachEventInfo);
      })(key);
    });
  });
  shoptet.dev = shoptet.dev || {};
  shoptet.dev.config = {};
  shoptet.dev.config.log = {
    colors: {
      success: { front: "#fff", back: "#5cb85c" },
      error: { front: "#fff", back: "#d9534f" },
      info: { front: "#fff", back: "#3276b1" },
      shell: { front: "#CBCAB4", back: "#002B36" },
    },
    fontSize: { larger: "14px" },
  };
  shoptet.dev.config.log.styles = {
    success:
      "background: " +
      shoptet.dev.config.log.colors.success.back +
      "; color: " +
      shoptet.dev.config.log.colors.success.front,
    error:
      "background: " +
      shoptet.dev.config.log.colors.error.back +
      "; color: " +
      shoptet.dev.config.log.colors.error.front,
    info:
      "background: " +
      shoptet.dev.config.log.colors.info.back +
      "; color: " +
      shoptet.dev.config.log.colors.info.front,
    successInv:
      "background: " +
      shoptet.dev.config.log.colors.success.front +
      "; color: " +
      shoptet.dev.config.log.colors.success.back,
    errorInv:
      "background: " +
      shoptet.dev.config.log.colors.error.front +
      "; color: " +
      shoptet.dev.config.log.colors.error.back,
    infoInv:
      "background: " +
      shoptet.dev.config.log.colors.info.front +
      "; color: " +
      shoptet.dev.config.log.colors.info.back,
    shell:
      "background: " +
      shoptet.dev.config.log.colors.shell.back +
      "; color: " +
      shoptet.dev.config.log.colors.shell.front,
    fontLarger: "font-size: " + shoptet.dev.config.log.fontSize.larger,
  };
  shoptet.dev.config.name = "Shoptet developers tools";
  shoptet.dev.config.version = "0.1.2";
  shoptet.dev.config.monitorEvents = false;
  shoptet.dev.enableEventsMonitoring = enableEventsMonitoring;
  shoptet.dev.disableEventsMonitoring = disableEventsMonitoring;
  shoptet.dev.printMonitoringInfo = printMonitoringInfo;
  shoptet.dev.printEventInfo = printEventInfo;
  shoptet.dev.attachEventInfo = attachEventInfo;
  document.addEventListener("DOMContentLoaded", function () {
    if (shoptet.cookie.get("monitorJSEvents")) {
      shoptet.dev.enableEventsMonitoring();
    }
  });
})(shoptet);

(function (shoptet) {
  shoptet.config = shoptet.config || {};
  shoptet.config.animationDuration = 300;
  shoptet.config.dismissTimeout = 6e3;
  shoptet.config.adminBarTimeout = 800;
  shoptet.config.breakpoints = {};
  shoptet.config.breakpoints.xs = 479;
  shoptet.config.breakpoints.sm = 767;
  shoptet.config.breakpoints.md = 991;
  shoptet.config.breakpoints.lg = 1199;
  shoptet.config.breakpoints.xl = 1439;
  shoptet.config.colorbox = {};
  shoptet.config.colorbox.opacity = 0.65;
  shoptet.config.colorbox.maxWidth = "98%";
  shoptet.config.colorbox.initialHeight = 480;
  shoptet.config.colorbox.widthXs = 300;
  shoptet.config.colorbox.widthSm = 500;
  shoptet.config.colorbox.widthMd = 700;
  shoptet.config.colorbox.widthLg = 1152;
  shoptet.config.colorbox.classXs = "shoptet-modal-xs";
  shoptet.config.colorbox.classSm = "shoptet-modal-sm";
  shoptet.config.colorbox.classMd = "shoptet-modal-md";
  shoptet.config.colorbox.classLg = "shoptet-modal-lg";
  shoptet.config.updateQuantityTimeout = 1e3;
  shoptet.config.cartActionUrl = "/action/Cart";
})(shoptet);

(function (shoptet) {
  function resizeEnd() {
    if (
      new Date() - shoptet.runtime.resize.rtime <
      shoptet.runtime.resize.delta
    ) {
      setTimeout(resizeEnd, shoptet.runtime.resize.delta);
    } else {
      shoptet.runtime.resize.timeout = false;
      shoptet.scripts.signalNativeEvent("resizeEnd", document);
      var window_changed =
        $(window).width() !== shoptet.runtime.resize.windowWidth;
      if (window_changed) {
        resizeEndCallback();
        shoptet.runtime.resize.windowWidth = $(window).width();
      }
    }
  }
  shoptet.runtime = shoptet.runtime || {};
  shoptet.runtime.setPcsTimeout = false;
  shoptet.runtime.dismiss = setTimeout(function () {
    hideMsg();
  }, shoptet.config.dismissTimeout);
  shoptet.runtime.resize = {
    delta: 300,
    rtime: false,
    timeout: false,
    windowWidth: false,
  };
  shoptet.runtime.cloudZoom = false;
  shoptet.runtime.updateMenu = false;
  shoptet.runtime.adminBar = false;
  shoptet.scripts.libs.runtime.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "runtime");
  });
  document.addEventListener("DOMContentLoaded", function () {
    shoptet.runtime.resize.windowWidth = $(window).width();
  });
  window.addEventListener("resize", function () {
    shoptet.runtime.resize.rtime = new Date();
    if (shoptet.runtime.resize.timeout === false) {
      shoptet.runtime.resize.timeout = true;
      setTimeout(function () {
        shoptet.runtime.resizeEnd();
      }, shoptet.runtime.resize.delta);
    }
  });
})(shoptet);

(function (shoptet) {
  function open(options) {
    $.colorbox(options);
  }
  function close() {
    $.colorbox.close();
  }
  function resize(options) {
    $.colorbox.resize(options);
  }
  function shoptetResize() {
    var width;
    var $colorbox = $("#colorbox");
    if (
      $colorbox.hasClass("colorbox-xs") ||
      $colorbox.hasClass(shoptet.config.colorbox.classXs)
    ) {
      width = shoptet.config.colorbox.widthXs;
    } else if (
      $colorbox.hasClass("colorbox-sm") ||
      $colorbox.hasClass(shoptet.config.colorbox.classSm)
    ) {
      width = shoptet.config.colorbox.widthSm;
    } else if (
      $colorbox.hasClass("colorbox-lg") ||
      $colorbox.hasClass(shoptet.config.colorbox.classLg)
    ) {
      width = shoptet.config.colorbox.widthLg;
    } else {
      width = shoptet.config.colorbox.widthMd;
    }
    if (!detectResolution(shoptet.config.breakpoints.lg)) {
      var responsiveWidth;
      if (shoptet.abilities.about.generation === 3) {
        responsiveWidth = $(".content-wrapper").width();
      } else {
        responsiveWidth = $("#content").width() - 30;
      }
      width = responsiveWidth > width ? width : responsiveWidth;
      shoptet.modal.resize({ width: width });
    } else {
      shoptet.modal.resize({ width: width });
    }
  }
  shoptet.modal = shoptet.modal || {};
  shoptet.scripts.libs.modal.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "modal");
  });
})(shoptet);

(function (shoptet) {
  function getSelectValue(select) {
    return select.value;
  }
  function getCheckedInputValue(containingElement) {
    var inputs = containingElement.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].value;
      }
    }
    return false;
  }
  function createDocumentFromString(string) {
    return new DOMParser().parseFromString(string, "text/html");
  }
  function serializeData(data) {
    if (typeof data === "object") {
      try {
        var params = [];
        for (key in data) {
          params.push(key + "=" + data[key]);
        }
        return params.join("&");
      } catch (e) {
        console.error(e);
        return data;
      }
    }
    return data;
  }
  function serializeForm(form) {
    var fallBack = form;
    if (typeof form === "undefined" || form === null) {
      return form;
    }
    if (form instanceof jQuery) {
      form = form.get(0);
    }
    if (form instanceof HTMLFormElement) {
      form = new FormData(form);
    }
    if (form instanceof FormData) {
      var object = {};
      try {
        var formDataEntries = form.entries(),
          formDataEntry = formDataEntries.next(),
          pair;
        while (!formDataEntry.done) {
          pair = formDataEntry.value;
          object[pair[0]] = pair[1];
          formDataEntry = formDataEntries.next();
        }
        return serializeData(object);
      } catch (e) {
        console.error(e);
        form = $(fallBack).serialize();
        return form;
      }
    } else {
      return form;
    }
  }
  function createEventNameFromFormAction(action) {
    var actionName = action.replace(shoptet.config.cartActionUrl, "");
    actionName = actionName.replace(/\//gi, "");
    actionName =
      "ShoptetCart" + actionName.charAt(0).toUpperCase() + actionName.slice(1);
    return actionName;
  }
  function fitsToParentWidth(el, paddingRight) {
    var reserved = typeof paddingRight === "undefined" ? 0 : paddingRight;
    var parent = el.offsetParent;
    if (!parent) {
      return true;
    }
    if (el.offsetLeft + el.offsetWidth > parent.offsetWidth - reserved) {
      return false;
    }
    return true;
  }
  function addClassToElements(elements, className) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add(className);
    }
  }
  function removeClassFromElements(elements, className) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove(className);
    }
  }
  shoptet.common = shoptet.common || {};
  shoptet.scripts.libs.common.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "common");
  });
  shoptet.common.keyCodes = { backspace: 8, enter: 13, escape: 27 };
})(shoptet);

(function (shoptet) {
  function postSuccessfulValidation(form) {
    return true;
  }
  function postFailedValidation(form) {}
  shoptet.custom = shoptet.custom || {};
  shoptet.custom.postSuccessfulValidation = postSuccessfulValidation;
  shoptet.custom.postFailedValidation = postFailedValidation;
})(shoptet);

(function (shoptet) {
  function get(cookieName) {
    var regexp = new RegExp("; " + cookieName + "=([^;]*);");
    var match = ("; " + document.cookie + ";").match(regexp);
    if (cookieName && match) {
      return unescape(match[1]);
    }
    return false;
  }
  function create(name, value, expires) {
    if (typeof expires === "undefined") {
      console.log(
        "%cCookie expiration is required",
        shoptet.dev.config.log.styles.error
      );
      return false;
    }
    if (typeof name !== "string") {
      console.log(
        "%cCookie name must be a string",
        shoptet.dev.config.log.styles.error
      );
      return false;
    }
    var defaultExpiration = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    for (var key in expires) {
      if (expires.hasOwnProperty(key)) {
        defaultExpiration[key] = expires[key];
      }
    }
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var expiration = new Date(
      year + parseInt(defaultExpiration.years),
      month + parseInt(defaultExpiration.months),
      day + parseInt(defaultExpiration.days),
      hour + parseInt(defaultExpiration.hours),
      minute + parseInt(defaultExpiration.minutes),
      second + parseInt(defaultExpiration.seconds)
    );
    document.cookie =
      name + "=" + value + "; expires=" + expiration + "; path=/";
    return true;
  }
  shoptet.cookie = shoptet.cookie || {};
  shoptet.scripts.libs.cookie.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "cookie");
  });
})(shoptet);

(function (shoptet) {
  function toFloat(value) {
    if (typeof value !== "string") {
      value = value + "";
    }
    return parseFloat(value.replace(shoptet.config.decSeparator, "."));
  }
  function toLocaleFloat(value, decimals, trim) {
    if (typeof value === "number") {
      value = value.toFixed(decimals === "undefined" ? 0 : decimals).toString();
      if (trim && value.indexOf(".") != -1) {
        value = value.replace(/\.?0*$/, "");
      }
      return value.replace(".", shoptet.config.decSeparator);
    }
    return value;
  }
  function resolveDecimalSeparator(decimalSeparator) {
    if (typeof decimalSeparator !== "undefined") {
      return decimalSeparator;
    }
    return shoptet.config.decSeparator;
  }
  function resolveThousandSeparator(thousandSeparator) {
    if (typeof thousandSeparator !== "undefined") {
      return thousandSeparator;
    }
    return shoptet.config.thousandSeparator;
  }
  function resolveDecimalPlaces(decimalPlaces) {
    if (typeof decimalPlaces !== "undefined") {
      if (!isNaN(decimalPlaces)) {
        return Math.abs(decimalPlaces);
      }
    }
    if (!isNaN(shoptet.config.decPlaces)) {
      return Math.abs(shoptet.config.decPlaces);
    }
    return 0;
  }
  function resolveCurrencySymbol(symbol) {
    if (typeof symbol !== "undefined") {
      return symbol;
    }
    return shoptet.config.currencySymbol;
  }
  function resolveCurrencySymbolPosition(symbolPosition) {
    if (typeof symbolPosition !== "undefined") {
      return symbolPosition;
    }
    return shoptet.config.currencySymbolLeft;
  }
  function formatNumber(decimalPlaces, decimalSeparator, thousandSeparator) {
    var number = this;
    var thSep = resolveThousandSeparator(thousandSeparator);
    if (!Number.isInteger(number.valueOf())) {
      var decSep = resolveDecimalSeparator(decimalSeparator);
      var decPlaces = resolveDecimalPlaces(decimalPlaces);
    } else {
      var decSep = 0;
      var decPlaces = 0;
    }
    var s = number < 0 ? "-" : "";
    var i = parseInt((number = Math.abs(+number || 0).toFixed(decPlaces))) + "";
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return (
      s +
      (j ? i.substr(0, j) + thSep : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thSep) +
      (decPlaces
        ? decSep +
          Math.abs(number - i)
            .toFixed(decPlaces)
            .slice(2)
        : "")
    );
  }
  function formatAsCurrency(
    currencySymbol,
    currencyPosition,
    decimalPlaces,
    decimalSeparator,
    thousandSeparator
  ) {
    var number = this;
    var symbol = resolveCurrencySymbol(currencySymbol);
    var positionLeft = resolveCurrencySymbolPosition(currencyPosition);
    return (
      (!positionLeft ? symbol : "") +
      " " +
      number.ShoptetFormatNumber(
        decimalPlaces,
        decimalSeparator,
        thousandSeparator
      ) +
      (positionLeft ? " " + symbol : "")
    ).trim();
  }
  Number.prototype.ShoptetFormatNumber = formatNumber;
  Number.prototype.ShoptetFormatAsCurrency = formatAsCurrency;
  function resolveMinimumAmount(decimals) {
    switch (decimals) {
      case 1:
        return 0.1;
      case 2:
        return 0.01;
      case 3:
        return 0.001;
      default:
        return 1;
    }
  }
  function updateQuantity(el, min, max, decimals, action, callback) {
    var value = shoptet.helpers.toFloat(el.value);
    if (isNaN(value)) {
      return false;
    }
    var decimals = typeof decimals !== "undefined" ? toFloat(decimals) : 0;
    var min =
      typeof min !== "undefined"
        ? toFloat(min)
        : resolveMinimumAmount(decimals);
    var max =
      typeof max !== "undefined"
        ? toFloat(max)
        : toFloat(shoptet.config.defaultProductMaxAmount);
    if (action === "increase") {
      value += min > 1 ? 1 : min;
    } else {
      value -= min > 1 ? 1 : min;
    }
    if (value < min || value > max) {
      return false;
    }
    el.value = shoptet.helpers.toLocaleFloat(value, decimals, true);
    if (typeof callback === "function") {
      callback();
    }
    return true;
  }
  function isTouchDevice() {
    var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
    var mq = function (query) {
      return window.matchMedia(query).matches;
    };
    if (
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
      return true;
    }
    var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
      ""
    );
    return mq(query);
  }
  shoptet.helpers = shoptet.helpers || {};
  shoptet.scripts.libs.helpers.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "helpers");
  });
})(shoptet);

function getShoptetDataLayer(key) {
  if (dataLayer[0].shoptet) {
    if (key) {
      return dataLayer[0].shoptet[key];
    } else {
      return dataLayer[0].shoptet;
    }
  }
  return undefined;
}
function getShoptetProductsList() {
  return shoptet.tracking.productsList;
}
(function (shoptet) {
  function getFormAction(formAction) {
    if (formAction === shoptet.config.addToCartUrl) {
      return shoptet.config.addToCartUrl;
    } else if (formAction === shoptet.config.removeFromCartUrl) {
      return shoptet.config.removeFromCartUrl;
    } else if (formAction === shoptet.config.updateCartUrl) {
      return shoptet.config.updateCartUrl;
    } else if (formAction === shoptet.config.addDiscountCouponUrl) {
      return shoptet.config.addDiscountCouponUrl;
    } else if (formAction === shoptet.config.setSelectedGiftUrl) {
      return shoptet.config.setSelectedGiftUrl;
    }
    return false;
  }
  function resolveUpdateAction(data) {
    if (data.amount < data.previousAmount) {
      return "remove";
    } else if (data.amount > 0) {
      return "add";
    }
    return false;
  }
  function resolveAmount(formAction, data) {
    var amount = data.amount;
    if (
      shoptet.tracking.getFormAction(formAction) ===
      shoptet.config.updateCartUrl
    ) {
      amount = Math.abs(data.amount - data.previousAmount);
      if (amount === 0) {
        amount = data.previousAmount;
      }
    }
    return amount;
  }
  function resolveTrackingAction(formAction, data) {
    if (formAction === shoptet.config.updateCartUrl) {
      return shoptet.tracking.resolveUpdateAction(data);
    } else if (formAction === shoptet.config.addToCartUrl) {
      return "add";
    } else if (formAction === shoptet.config.removeFromCartUrl) {
      return "remove";
    }
    return "ViewContent";
  }
  function handleAction(form, response) {
    var formAction = shoptet.tracking.getFormAction(
      form.getAttribute("action")
    );
    if (!formAction) {
      return;
    }
    var priceId = false;
    var priceIdInput = form.querySelector("[name=priceId]");
    if (priceIdInput) {
      priceId = priceIdInput.value;
    }
    shoptet.tracking.updateDataLayerCartInfo(response);
    if (priceId) {
      trackProducts(form, priceId, formAction, [
        shoptet.tracking.trackGoogleCart,
        shoptet.tracking.trackFacebookPixel,
        shoptet.tracking.updateDataLayer,
      ]);
    }
  }
  function trackProducts(form, priceId, formAction, trackingFunctions) {
    if (typeof shoptet.tracking.productsList !== "object") {
      return;
    }
    productData = shoptet.tracking.productsList[priceId];
    if (typeof productData !== "object") {
      return;
    }
    var amountInput = form.querySelector("input[name=amount]"),
      amount = 1,
      previousAmount = false;
    if (amountInput) {
      amount = parseFloat(amountInput.value);
      amount = amount > 0 ? amount : 1;
      previousAmount = parseFloat(amountInput.defaultValue);
    }
    productData.amount = amount;
    productData.previousAmount = previousAmount;
    trackingFunctions.forEach(function (trackingFunction) {
      if (typeof trackingFunction === "function") {
        trackingFunction(productData, formAction);
      }
    });
    shoptet.scripts.signalCustomEvent("ShoptetProductsTracked");
  }
  function trackFacebookPixel(fbPixelData, formAction) {
    if (typeof fbq === "function") {
      var action = shoptet.tracking.resolveTrackingAction(
        formAction,
        fbPixelData
      );
      var eventName;
      var amount = shoptet.tracking.resolveAmount(formAction, fbPixelData);
      var data = {
        content_name: fbPixelData.content_name,
        content_category: fbPixelData.content_category,
        content_ids: fbPixelData.content_ids,
        content_type: "product",
        value: parseFloat(fbPixelData.value) * amount,
        currency: fbPixelData.currency,
      };
      switch (action) {
        case "remove":
          eventName = "trackCustom";
          action = "RemoveFromCart";
          break;
        case "add":
          eventName = "track";
          action = "AddToCart";
          break;
        case "ViewContent":
          eventName = "track";
          action = "ViewContent";
          break;
        default:
          return;
      }
      fbq(eventName, action, data);
    }
    shoptet.scripts.signalCustomEvent("ShoptetFacebookPixelTracked");
  }
  function trackGoogleCart(gaData, formAction) {
    if (typeof ga === "function") {
      var action = shoptet.tracking.resolveTrackingAction(formAction, gaData);
      var title;
      switch (action) {
        case "add":
          title = "add to cart";
          break;
        case "remove":
          title = "remove from cart";
          break;
        default:
          return;
      }
      var amount = shoptet.tracking.resolveAmount(formAction, gaData);
      ga("ec:addProduct", {
        id: gaData.content_ids[0],
        name: gaData.base_name,
        category: gaData.content_category,
        brand: gaData.manufacturer,
        variant: gaData.variant,
        price: gaData.valueWoVat,
        quantity: amount,
      });
      ga("ec:setAction", action);
      ga("send", "event", "UX", "click", title);
    }
    shoptet.scripts.signalCustomEvent("ShoptetGoogleCartTracked");
  }
  function updateDataLayer(data, formAction) {
    if (typeof dataLayer === "object") {
      var action = shoptet.tracking.resolveTrackingAction(formAction, data);
      var amount = shoptet.tracking.resolveAmount(formAction, data);
      var itemWasHandled = false;
      var GTMshoppingCart = { ecommerce: { currencyCode: data.currency } };
      productData = {};
      productData.id = data.content_ids[0];
      productData.name = data.base_name;
      productData.brand = data.manufacturer;
      productData.category = data.content_category;
      productData.variant = data.variant;
      productData.price = data.value;
      productData.quantity = data.amount;
      for (var key in productData) {
        if (productData[key] === null) {
          delete productData[key];
        }
      }
      dataLayer[0].shoptet.cart.forEach(function (el, i) {
        if (itemWasHandled) {
          return;
        }
        if (el.code === data.content_ids[0]) {
          switch (action) {
            case "add":
              el.quantity = el.quantity + amount;
              itemWasHandled = true;
              break;
            case "remove":
              if (el.quantity - amount > 0) {
                el.quantity = el.quantity - amount;
              } else {
                dataLayer[0].shoptet.cart.splice(i, 1);
              }
              GTMshoppingCart.event = "removeFromCart";
              GTMshoppingCart.ecommerce.remove = [];
              GTMshoppingCart.ecommerce.remove.push(productData);
              itemWasHandled = true;
              break;
          }
        }
      });
      if (!itemWasHandled) {
        dataLayer[0].shoptet.cart.push({
          code: data.content_ids[0],
          quantity: amount,
          priceWithVat: data.value,
        });
      }
      if (typeof GTMshoppingCart.event === "undefined") {
        GTMshoppingCart.event = "addToCart";
        GTMshoppingCart.ecommerce.add = [];
        GTMshoppingCart.ecommerce.add.push(productData);
      }
      dataLayer.push(GTMshoppingCart);
    }
    shoptet.scripts.signalCustomEvent("ShoptetDataLayerUpdated");
  }
  function handlePromoClick(el) {
    var promo = shoptet.tracking.bannersList[el.dataset.ecPromoId];
    if (promo) {
      ga("ec:addPromo", promo);
      ga("ec:setAction", "promo_click");
      ga("send", "event", "Internal Promotions", "click", promo.name);
    }
  }
  function trackProductsFromPayload(requestedDocument) {
    var trackingScript = requestedDocument.getElementById("trackingScript");
    if (trackingScript) {
      var trackingProducts = JSON.parse(
        trackingScript.getAttribute("data-products")
      );
      shoptet.tracking.productsList = $.extend(
        trackingProducts.products,
        shoptet.tracking.productsList
      );
    }
  }
  function updateDataLayerCartInfo(response) {
    if (typeof dataLayer === "object") {
      var leftToFreeShipping = response.getFromPayload("leftToFreeShipping");
      if (leftToFreeShipping !== null) {
        dataLayer[0].shoptet.cartInfo.leftToFreeShipping = leftToFreeShipping;
      }
      var freeShipping = response.getFromPayload("freeShipping");
      if (freeShipping !== null) {
        dataLayer[0].shoptet.cartInfo.freeShipping = freeShipping;
      }
      var discountCoupon = response.getFromPayload("discountCoupon");
      if (discountCoupon !== null) {
        dataLayer[0].shoptet.cartInfo.discountCoupon = discountCoupon;
      }
      var leftToFreeGift = response.getFromPayload("leftToFreeGift");
      if (leftToFreeGift !== null) {
        dataLayer[0].shoptet.cartInfo.leftToFreeGift = leftToFreeGift;
      }
      var freeGift = response.getFromPayload("freeGift");
      if (freeGift !== null) {
        dataLayer[0].shoptet.cartInfo.freeGift = freeGift;
      }
      var trackingContainer = response.getFromPayload("trackingContainer");
      if (trackingContainer !== null) {
        trackingContainer = JSON.parse(trackingContainer);
        shoptet.tracking.productsList = $.extend(
          trackingContainer.products,
          shoptet.tracking.productsList
        );
      }
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    var i;
    var imageBanners = document.querySelectorAll("a[data-ec-promo-id]");
    for (i = 0; i < imageBanners.length; i++) {
      (function (i) {
        imageBanners[i].addEventListener("click", function () {
          shoptet.tracking.handlePromoClick(imageBanners[i]);
        });
      })(i);
    }
    var textBanners = document.querySelectorAll("span[data-ec-promo-id]");
    for (i = 0; i < textBanners.length; i++) {
      (function (i) {
        var linksInTextBanner = textBanners[i].querySelectorAll("a");
        (function (links, banner) {
          for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function () {
              shoptet.tracking.handlePromoClick(banner);
            });
          }
        })(linksInTextBanner, textBanners[i]);
      })(i);
    }
  });
  shoptet.tracking = shoptet.tracking || {};
  shoptet.scripts.libs.tracking.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "tracking");
  });
})(shoptet);

(function (shoptet) {
  function photo360init(el) {
    var imageContainer = el;
    var config = {
      rotationSpeed: 100,
      pixelsPerFrame: 10,
      fullscreenDelay: 300,
      url: "/action/ProductDetail/Get360Images/",
    };
    var classes = {
      container: "image360",
      holder: "image360-holder",
      preview: "image360-preview",
      loadedEl: "image360-loaded",
      fullscreenOn: "image360-fullscreen-on",
      fullscreenTarget: "image360-fullscreen-target",
      iconFullscreenTurnedOn: "icon-contract",
      iconFullscreenTurnedOff: "icon-expand",
      navigation: {
        play: "image360-play",
        prev: "image360-prev",
        next: "image360-next",
        fullscreen: "image360-fullscreen",
      },
    };
    var runtime = {
      currentFrame: 0,
      framesCount: 0,
      fullscreenImagesLoaded: false,
      fullscreenOn: false,
      image360images: { normal: [], fullscreen: [] },
      intervals: { prevImage: false, nextImage: false, play: false },
      lastPosition: 0,
      normalImagesLoaded: false,
      scriptRotationInProgress: false,
      userRotationInProgress: false,
    };
    var imageHolder = document.createElement("div");
    imageHolder.classList.add(classes.holder);
    imageContainer.appendChild(imageHolder);
    assignEventListeners(imageContainer, imageHolder);
    function assignEventListeners(imageContainer, imageHolder) {
      imageHolder.addEventListener("dragstart", function (event) {
        event.preventDefault();
        if (runtime.scriptRotationInProgress) {
          play(imageContainer.querySelector("." + classes.navigation.play));
        }
      });
      if (shoptet.helpers.isTouchDevice()) {
        imageContainer.addEventListener("touchstart", function handler() {
          buildImage(imageContainer, "normal");
          imageContainer.removeEventListener("touchstart", handler);
        });
        imageHolder.addEventListener("touchstart", holderMousedown);
        imageHolder.addEventListener("touchmove", function (event) {
          holderMousemove(event);
        });
        imageHolder.addEventListener("touchend", holderMouseup);
        document.addEventListener("touchend", holderMouseup);
      } else {
        imageContainer.addEventListener("mouseenter", function handler() {
          buildImage(imageContainer, "normal");
          imageContainer.removeEventListener("mouseenter", handler);
        });
        imageHolder.addEventListener("mousedown", holderMousedown);
        imageHolder.addEventListener("mousemove", function (event) {
          holderMousemove(event);
        });
        imageHolder.addEventListener("mouseup", holderMouseup);
        document.addEventListener("mouseup", holderMouseup);
      }
      window.addEventListener("keydown", function (e) {
        if (
          runtime.fullscreenOn &&
          (e.keyCode === shoptet.common.keyCodes.escape ||
            e.keyCode === shoptet.common.keyCodes.backspace)
        ) {
          e.preventDefault();
          navigationFullscreenClick(e, true);
        }
      });
    }
    function buildNavigation(imageContainer) {
      var playButton = document.createElement("span");
      playButton.classList.add(classes.navigation.play);
      playButton.classList.add("shoptet-icon");
      playButton.classList.add("icon-play");
      var prevButton = document.createElement("span");
      prevButton.classList.add(classes.navigation.prev);
      prevButton.classList.add("shoptet-icon");
      prevButton.classList.add("icon-previous");
      var nextButton = document.createElement("span");
      nextButton.classList.add(classes.navigation.next);
      nextButton.classList.add("shoptet-icon");
      nextButton.classList.add("icon-next");
      var fullscreenButton = document.createElement("span");
      fullscreenButton.classList.add(classes.navigation.fullscreen);
      fullscreenButton.classList.add("shoptet-icon");
      fullscreenButton.classList.add(classes.iconFullscreenTurnedOff);
      var imageNav = document.createElement("div");
      imageNav.classList.add("image360-navigation");
      imageNav.appendChild(playButton);
      imageNav.appendChild(prevButton);
      imageNav.appendChild(nextButton);
      imageNav.appendChild(fullscreenButton);
      imageContainer.appendChild(imageNav);
      if (shoptet.helpers.isTouchDevice()) {
        playButton.addEventListener("touchstart", function (event) {
          event.stopPropagation();
          play(event.target);
        });
        prevButton.addEventListener("touchstart", function (event) {
          event.stopPropagation();
          navigationPrevMousedown(event);
        });
        prevButton.addEventListener("touchend", function (event) {
          event.stopPropagation();
          clearInterval(runtime.intervals.prevImage);
        });
        nextButton.addEventListener("touchstart", function (event) {
          event.stopPropagation();
          navigationNextMousedown(event);
        });
        nextButton.addEventListener("touchend", function (event) {
          event.stopPropagation();
          clearInterval(runtime.intervals.nextImage);
        });
        fullscreenButton.addEventListener("touchstart", function (event) {
          event.stopPropagation();
          setTimeout(function () {
            navigationFullscreenClick(event);
          }, config.fullscreenDelay);
        });
      } else {
        playButton.addEventListener("click", function (event) {
          event.stopPropagation();
          play(event.target);
        });
        prevButton.addEventListener("mousedown", function (event) {
          event.stopPropagation();
          navigationPrevMousedown(event);
        });
        prevButton.addEventListener("mouseup", function (event) {
          event.stopPropagation();
          clearInterval(runtime.intervals.prevImage);
        });
        prevButton.addEventListener("mouseleave", function (event) {
          event.stopPropagation();
          clearInterval(runtime.intervals.prevImage);
        });
        nextButton.addEventListener("mousedown", function (event) {
          event.stopPropagation();
          navigationNextMousedown(event);
        });
        nextButton.addEventListener("mouseup", function (event) {
          event.stopPropagation();
          clearInterval(runtime.intervals.nextImage);
        });
        nextButton.addEventListener("mouseleave", function (event) {
          event.stopPropagation();
          clearInterval(runtime.intervals.nextImage);
        });
        fullscreenButton.addEventListener("click", function (event) {
          event.stopPropagation();
          navigationFullscreenClick(event);
        });
      }
    }
    function buildImage(imageContainer, size) {
      imageContainer.classList.add(shoptet.ajax.pendingClass);
      var productId = imageContainer.dataset.productid;
      if (productId === "") {
        imageContainer.classList.remove(shoptet.ajax.pendingClass);
        showMessage(shoptet.messages["ajaxError"], "error");
        return;
      }
      var successCallback = function callback(response) {
        preloadImages(imageContainer, response.getPayload(), size);
      };
      var failedCallback = function () {
        imageContainer.classList.remove(shoptet.ajax.pendingClass);
      };
      shoptet.ajax.makeAjaxRequest(
        config.url,
        shoptet.ajax.requestTypes.post,
        { productId: productId, imageSize: imageContainer.dataset[size] },
        { success: successCallback, failed: failedCallback },
        { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
      );
    }
    function preloadImages(imageContainer, imageURLs, size) {
      runtime.framesCount = imageURLs.length - 1;
      for (var i = 0; i < imageURLs.length; i++) {
        var image = new Image();
        image.src = imageURLs[i];
        if (image.complete || image.readyState === 4) {
          loadSuccess(imageContainer, imageURLs[i], i, size);
        } else {
          image.addEventListener(
            "load",
            (function (i) {
              loadSuccess(imageContainer, imageURLs[i], i, size);
            })(i)
          );
          image.addEventListener(
            "error",
            (function (i) {
              loadSuccess(imageContainer, imageURLs[i], i, size);
            })(i)
          );
        }
      }
    }
    function getPositionX(event) {
      var positionX;
      if (typeof event.clientX !== "undefined") {
        positionX = event.clientX;
      } else {
        var touch = event.changedTouches[0];
        positionX = touch.pageX;
      }
      return positionX;
    }
    function loadSuccess(imageContainer, source, index, size) {
      runtime.image360images[size][index] = source;
      if (runtime.image360images[size].length === runtime.framesCount) {
        if (!runtime.normalImagesLoaded) {
          runtime.normalImagesLoaded = true;
          var imageHolder = imageContainer.querySelector("." + classes.holder);
          var imagePreview = imageContainer.querySelector(
            "." + classes.preview
          );
          imageHolder.appendChild(imagePreview);
          buildNavigation(imageContainer);
        }
        imageContainer.classList.remove(shoptet.ajax.pendingClass);
        imageContainer.classList.add(classes.loadedEl);
      }
    }
    function nextImage(imageContainer) {
      if (runtime.currentFrame > 0) {
        runtime.currentFrame = runtime.currentFrame - 1;
      } else {
        runtime.currentFrame = runtime.framesCount;
      }
      var size = runtime.fullscreenOn ? "fullscreen" : "normal";
      switchSrc(imageContainer, runtime.currentFrame, size);
    }
    function prevImage(imageContainer) {
      if (runtime.currentFrame < runtime.framesCount) {
        runtime.currentFrame = runtime.currentFrame + 1;
      } else {
        runtime.currentFrame = 0;
      }
      var size = runtime.fullscreenOn ? "fullscreen" : "normal";
      switchSrc(imageContainer, runtime.currentFrame, size);
    }
    function switchSrc(imageContainer, frame, size) {
      var newSrc = runtime.image360images[size][frame];
      if (typeof newSrc === "undefined") {
        var fallbackSize = size === "fullscreen" ? "normal" : "fullscreen";
        newSrc = runtime.image360images[fallbackSize][frame];
      }
      var imagePreview = imageContainer.querySelector("." + classes.preview);
      imagePreview.setAttribute("src", newSrc);
    }
    function holderMousedown(event) {
      event.stopPropagation();
      var touchLength = 1;
      if (typeof event.clientX === "undefined") {
        touchLength = event.touches.length;
      }
      if (touchLength === 1) {
        runtime.userRotationInProgress = true;
        runtime.lastPosition = getPositionX(event);
      }
    }
    function holderMousemove(event) {
      event.stopPropagation();
      var imageContainer = event.target.closest("." + classes.container);
      if (!runtime.userRotationInProgress) {
        return;
      }
      var deltaX = runtime.lastPosition - getPositionX(event);
      if (Math.abs(deltaX) > config.pixelsPerFrame) {
        if (deltaX > 0) {
          prevImage(imageContainer);
        } else if (deltaX < 0) {
          nextImage(imageContainer);
        }
        runtime.lastPosition = getPositionX(event);
      }
    }
    function holderMouseup() {
      runtime.userRotationInProgress = false;
    }
    function play(playButton) {
      var imageContainer = playButton.parentElement.parentElement;
      playButton.classList.toggle("icon-play");
      playButton.classList.toggle("icon-pause");
      if (runtime.scriptRotationInProgress) {
        runtime.scriptRotationInProgress = false;
        window.clearInterval(runtime.intervals.play);
      } else {
        runtime.scriptRotationInProgress = true;
        window.clearInterval(runtime.intervals.play);
        runtime.intervals.play = setInterval(function () {
          nextImage(imageContainer);
        }, config.rotationSpeed);
      }
    }
    function navigationPrevMousedown(event) {
      var imageContainer = event.target.parentElement.parentElement;
      if (runtime.scriptRotationInProgress) {
        play(imageContainer.querySelector("." + classes.navigation.play));
        return;
      }
      prevImage(imageContainer);
      clearInterval(runtime.intervals.prevImage);
      runtime.intervals.prevImage = setInterval(function () {
        prevImage(imageContainer);
      }, config.rotationSpeed);
    }
    function navigationNextMousedown(event) {
      var imageContainer = event.target.parentElement.parentElement;
      if (runtime.scriptRotationInProgress) {
        play(imageContainer.querySelector("." + classes.navigation.play));
        return;
      }
      nextImage(imageContainer);
      clearInterval(runtime.intervals.nextImage);
      runtime.intervals.nextImage = setInterval(function () {
        nextImage(imageContainer);
      }, config.rotationSpeed);
    }
    function navigationFullscreenClick(event, keyboard) {
      var fullscreenButton;
      if (typeof keyboard !== "undefined") {
        var fullscreenTarget = document.getElementsByClassName(
          classes.fullscreenTarget
        )[0];
        fullscreenButton = fullscreenTarget.querySelector(
          "." + classes.navigation.fullscreen
        );
      } else {
        fullscreenButton = event.target;
      }
      var imageContainer = fullscreenButton.closest(".image360");
      var body = document.getElementsByTagName("body")[0];
      if (
        fullscreenButton.classList.contains(classes.iconFullscreenTurnedOff)
      ) {
        if (!runtime.fullscreenImagesLoaded) {
          runtime.fullscreenImagesLoaded = true;
          buildImage(imageContainer, "fullscreen");
        }
        runtime.fullscreenOn = true;
        body.classList.add(classes.fullscreenOn);
        imageContainer.classList.add(classes.fullscreenTarget);
        fullscreenButton.classList.add(classes.iconFullscreenTurnedOn);
        fullscreenButton.classList.remove(classes.iconFullscreenTurnedOff);
        switchSrc(imageContainer, runtime.currentFrame, "fullscreen");
      } else {
        runtime.fullscreenOn = false;
        body.classList.remove(classes.fullscreenOn);
        imageContainer.classList.remove(classes.fullscreenTarget);
        fullscreenButton.classList.remove(classes.iconFullscreenTurnedOn);
        fullscreenButton.classList.add(classes.iconFullscreenTurnedOff);
        switchSrc(imageContainer, runtime.currentFrame, "normal");
      }
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    var elements = document.getElementsByClassName("image360");
    for (var key in elements) {
      if (elements.hasOwnProperty(key)) {
        photo360init(elements[key]);
      }
    }
  });
})(shoptet);

(function (shoptet) {
  function getDeliveryPointName(stockCode) {
    return shoptet.stockAvailabilities.content.stocks[stockCode].title;
  }
  function getDeliveryPointAmount(stockCode, productId, variantCode) {
    if (
      shoptet.stockAvailabilities.content.products[
        productId
      ].codes.hasOwnProperty(variantCode)
    ) {
      return shoptet.stockAvailabilities.content.products[productId].codes[
        variantCode
      ].stocks[stockCode];
    }
    return false;
  }
  function getStockAvailabilities(productIds) {
    if (shoptet.stockAvailabilities.content !== false) {
      return;
    }
    var successCallback = function (response) {
      shoptet.stockAvailabilities.content = response.getPayload();
      shoptet.stockAvailabilities.setStockAvailabilities();
    };
    var errorCallback = function () {
      showMessage(shoptet.messages["ajaxError"], "error");
    };
    shoptet.ajax.makeAjaxRequest(
      shoptet.config.stockAmountUrl + "?ids[]=" + productIds.join("&ids[]="),
      shoptet.ajax.requestTypes.get,
      "",
      { success: successCallback, error: errorCallback },
      { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
    );
  }
  function setStockAvailabilities() {
    var elements = document.getElementsByClassName("product-stock-amount");
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var title = [];
      for (var stock in shoptet.stockAvailabilities.content.stocks) {
        if (shoptet.stockAvailabilities.content.stocks.hasOwnProperty(stock)) {
          var deliveryPointName = shoptet.stockAvailabilities.getDeliveryPointName(
            stock
          );
          var deliveryPointAmount = shoptet.stockAvailabilities.getDeliveryPointAmount(
            stock,
            element.getAttribute("data-product-id"),
            element.getAttribute("data-variant-code")
          );
          if (typeof deliveryPointAmount === "undefined") {
            continue;
          } else if (deliveryPointAmount === false) {
            deliveryPointAmount = "-";
          } else if (typeof deliveryPointAmount === "number") {
            deliveryPointAmount = shoptet.helpers.toLocaleFloat(
              deliveryPointAmount,
              element.getAttribute("data-decimals"),
              true
            );
          }
          if (deliveryPointName && deliveryPointAmount !== false) {
            title.push(
              deliveryPointName +
                " " +
                deliveryPointAmount +
                element.getAttribute("data-variant-unit")
            );
            element.setAttribute("title", title.join("<br />"));
            fixTooltipAfterChange(element);
          }
        }
      }
    }
  }
  function attachEventListeners() {
    shoptet.stockAvailabilities.content = false;
    var elements = document.getElementsByClassName("product-stock-amount");
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.removeEventListener(
        "mouseenter",
        shoptet.stockAvailabilities.mouseEnterListener
      );
      element.addEventListener(
        "mouseenter",
        shoptet.stockAvailabilities.mouseEnterListener
      );
      element.removeEventListener(
        "mouseleave",
        shoptet.stockAvailabilities.mouseLeaveListener
      );
      element.addEventListener(
        "mouseleave",
        shoptet.stockAvailabilities.mouseLeaveListener
      );
    }
  }
  function mouseEnterListener(e) {
    e.target.classList.add("hovered");
    if (shoptet.stockAvailabilities.content === false) {
      var productIds = [];
      var elements = document.getElementsByClassName("product-stock-amount");
      for (var i = 0; i < elements.length; i++) {
        productIds.push(elements[i].getAttribute("data-product-id"));
      }
      shoptet.stockAvailabilities.getStockAvailabilities(productIds);
    }
  }
  function mouseLeaveListener(e) {
    e.target.classList.remove("hovered");
  }
  shoptet.stockAvailabilities = shoptet.stockAvailabilities || {};
  shoptet.stockAvailabilities.content = false;
  shoptet.stockAvailabilities.events = [
    "DOMContentLoaded",
    "ShoptetDOMPageContentLoaded",
    "ShoptetDOMPageMoreProductsLoaded",
    "ShoptetDOMCartContentLoaded",
  ];
  shoptet.scripts.libs.stockAvailabilities.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "stockAvailabilities");
  });
  for (var i = 0; i < shoptet.stockAvailabilities.events.length; i++) {
    document.addEventListener(
      shoptet.stockAvailabilities.events[i],
      shoptet.stockAvailabilities.attachEventListeners
    );
  }
})(shoptet);

(function (shoptet) {
  function initSurcharges() {
    var surchargeSelector = ".surcharge-list .surcharge-parameter";
    var surcharges = document.querySelectorAll(surchargeSelector);
    if (surcharges.length) {
      surcharges.forEach(function (elem) {
        elem.addEventListener("change", shoptet.surcharges.updatePrices);
      });
    }
  }
  function getSurchargePrices(wrapper) {
    var activeOptions = wrapper.querySelectorAll(
      "select.surcharge-parameter option:checked"
    );
    activeOptions.forEach(function (activeOption) {
      var valueId = activeOption.value;
      if (valueId && !shoptet.surcharges.values.hasOwnProperty(valueId)) {
        shoptet.surcharges.values[valueId] = {};
        var finalPrice = activeOption.getAttribute(
          "data-surcharge-final-price"
        );
        var additionalPrice = activeOption.getAttribute(
          "data-surcharge-additional-price"
        );
        shoptet.surcharges.values[valueId].finalPrice =
          finalPrice === null ? 0 : parseFloat(finalPrice);
        shoptet.surcharges.values[valueId].additionalPrice =
          additionalPrice === null ? 0 : parseFloat(additionalPrice);
      }
      for (var property in shoptet.surcharges.values) {
        if (property === valueId) {
          shoptet.surcharges.totalSurchargeFinalPrice +=
            shoptet.surcharges.values[property].finalPrice;
          shoptet.surcharges.totalSurchargeAdditionalPrice +=
            shoptet.surcharges.values[property].additionalPrice;
        }
      }
    });
  }
  function writePrices(wrapper) {
    var finalPriceWrapper = wrapper.querySelectorAll(
      ".price-final-holder.calculated:not(.noDisplay)"
    );
    var additionalPriceWrapper = wrapper.querySelectorAll(
      ".price-additional-holder.calculated:not(.noDisplay)"
    );
    for (var i = 0; i < finalPriceWrapper.length; i++) {
      var finalPrice = parseFloat(
        finalPriceWrapper.item(i).getAttribute("data-price")
      );
      finalPrice += shoptet.surcharges.totalSurchargeFinalPrice;
      finalPrice = Number(finalPrice).ShoptetFormatAsCurrency(
        undefined,
        undefined
      );
      finalPriceWrapper
        .item(i)
        .querySelector(".calculated-price").textContent = finalPrice;
    }
    for (var i = 0; i < additionalPriceWrapper.length; i++) {
      var additionalPrice = parseFloat(
        additionalPriceWrapper.item(i).getAttribute("data-price")
      );
      additionalPrice += shoptet.surcharges.totalSurchargeAdditionalPrice;
      additionalPrice = Number(additionalPrice).ShoptetFormatAsCurrency(
        undefined,
        undefined
      );
      additionalPriceWrapper
        .item(i)
        .querySelector(".calculated-price").textContent = additionalPrice;
    }
  }
  function updatePrices() {
    getSurchargePrices(document);
    writePrices(document);
    shoptet.surcharges.totalSurchargeFinalPrice = 0;
    shoptet.surcharges.totalSurchargeAdditionalPrice = 0;
  }
  shoptet.surcharges = shoptet.surcharges || {};
  shoptet.scripts.libs.surcharges.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "surcharges");
  });
  shoptet.surcharges.values = {};
  shoptet.surcharges.totalSurchargeFinalPrice = 0;
  shoptet.surcharges.totalSurchargeAdditionalPrice = 0;
})(shoptet);

(function (shoptet) {
  function disableAddingToCart() {
    document
      .getElementsByTagName("body")[0]
      .classList.add("disabled-add-to-cart");
  }
  function enableAddingToCart() {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("disabled-add-to-cart", "variant-not-chosen");
  }
  function hasToDisableCartButton() {
    if (!$("body").hasClass("type-product")) {
      return false;
    }
    if (
      $(
        '.variant-list option[value=""]:selected, .variant-list option[data-disable-button="1"]:selected,' +
          ' .variant-default:checked, .variant-list .advanced-parameter input[data-disable-button="1"]:checked'
      ).length
    ) {
      return true;
    } else {
      return false;
    }
  }
  function handleSubmit($el) {
    if ($el.attr("id") === "product-detail-form") {
      var variantNotSelected = false;
      $(".variant-list select").each(function () {
        if ($(this).val() == "") {
          variantNotSelected = true;
        }
      });
      var $target = $(".variant-not-chosen-anchor");
      if (variantNotSelected || $(".variant-default").is(":checked")) {
        $("body").addClass("variant-not-chosen");
        shoptet.variantsCommon.reasonToDisable =
          shoptet.messages["chooseVariant"];
        showMessage(
          shoptet.variantsCommon.reasonToDisable,
          "error",
          "",
          false,
          false
        );
        setTimeout(function () {
          scrollToEl($target);
        }, shoptet.config.animationDuration);
        return false;
      }
      if ($("body").hasClass("disabled-add-to-cart")) {
        if (shoptet.variantsCommon.reasonToDisable) {
          showMessage(
            shoptet.variantsCommon.reasonToDisable,
            "error",
            "",
            false,
            false
          );
          setTimeout(function () {
            scrollToEl($target);
          }, shoptet.config.animationDuration);
        }
        return false;
      }
    }
    return true;
  }
  function handleBrowserValueRestoration() {
    window.addEventListener("load", function () {
      var elements = document.querySelectorAll(
        ".variant-list select, .surcharge-list select, .advanced-parameter input:checked"
      );
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].value !== "") {
          shoptet.scripts.signalNativeEvent("change", elements[i]);
        }
      }
    });
  }
  shoptet.variantsCommon = shoptet.variantsCommon || {};
  shoptet.scripts.libs.variantsCommon.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "variantsCommon");
  });
  shoptet.variantsCommon.reasonToDisable = false;
  shoptet.variantsCommon.noDisplayClasses = "no-display noDisplay";
})(shoptet);

(function (shoptet) {
  function handler() {
    var $simpleVariants;
    var $variant;
    var $activeOption;
    if ($(".advanced-parameter input").length) {
      $simpleVariants = $(".advanced-parameter input");
      $activeOption = $(".advanced-parameter input:checked");
    } else {
      $simpleVariants = $("#simple-variants-select");
      $activeOption = $("#simple-variants-select option:selected");
    }
    if ($simpleVariants.length) {
      if ($activeOption.attr("data-disable-reason")) {
        shoptet.variantsCommon.reasonToDisable = $activeOption.attr(
          "data-disable-reason"
        );
      }
      if (shoptet.variantsCommon.hasToDisableCartButton()) {
        shoptet.variantsCommon.disableAddingToCart();
      } else {
        shoptet.variantsCommon.enableAddingToCart();
      }
    }
    $simpleVariants.bind("change ShoptetSelectedParametersReset", function (e) {
      shoptet.scripts.signalCustomEvent("ShoptetSimpleVariantChange", e.target);
      hideMsg(true);
      if ($(this).is("input")) {
        $variant = $(this);
        $variant
          .parents(".variant-list")
          .find(".advanced-parameter-inner")
          .removeClass("yes-before");
        if (e.type === "ShoptetSelectedParametersReset") {
          return;
        }
        $variant.siblings(".advanced-parameter-inner").addClass("yes-before");
      } else {
        $variant = $(this).find("option:selected");
      }
      shoptet.variantsSimple.switcher($variant);
      shoptet.variantsSimple.loadedVariant = $variant;
      shoptet.variantsCommon.reasonToDisable = $variant.attr(
        "data-disable-reason"
      );
      if (shoptet.variantsCommon.reasonToDisable) {
        shoptet.variantsCommon.disableAddingToCart();
        showMessage(
          shoptet.variantsCommon.reasonToDisable,
          "error",
          "",
          false,
          false
        );
        shoptet.scripts.signalCustomEvent("ShoptetVariantUnavailable");
      } else {
        shoptet.scripts.signalCustomEvent("ShoptetVariantAvailable");
      }
    });
  }
  function switcher($variant) {
    if (shoptet.variantsCommon.hasToDisableCartButton()) {
      shoptet.variantsCommon.disableAddingToCart();
    } else {
      shoptet.variantsCommon.enableAddingToCart();
    }
    if ($variant.attr("data-codeid")) {
      $("#product-detail-form")
        .find("input[name=priceId]")
        .val($variant.attr("data-codeid"));
    }
    shoptet.tracking.trackProducts(
      $("#product-detail-form")[0],
      $variant.data("codeid"),
      "ViewContent",
      [shoptet.tracking.trackFacebookPixel]
    );
    var bigImageUrl = $variant.attr("data-big");
    if (typeof bigImageUrl !== "undefined") {
      var replaceInfo = resolveImageFormat();
      shoptet.products.replaceImage(
        bigImageUrl,
        $variant.attr("data-" + replaceInfo.format),
        replaceInfo.link
      );
    }
    var variantIndex = $variant.data("index");
    if (typeof variantIndex !== "undefined") {
      $(
        ".p-detail-inner .choose-variant, .p-detail-inner .default-variant," +
          " .p-code .choose-variant, .p-code .default-variant"
      ).addClass(shoptet.variantsCommon.noDisplayClasses);
      if (variantIndex == 0) {
        $(
          ".p-detail-inner .default-variant, .p-code .default-variant"
        ).removeClass(shoptet.variantsCommon.noDisplayClasses);
      } else {
        $(
          ".p-detail-inner .choose-variant." +
            variantIndex +
            ", .p-code .choose-variant." +
            variantIndex
        ).removeClass(shoptet.variantsCommon.noDisplayClasses);
        $(".add-to-cart .amount").val(
          shoptet.helpers.toLocaleFloat(
            $variant.data("min"),
            $variant.data("decimals"),
            true
          )
        );
        $(".add-to-cart .amount").data({
          min: $variant.data("min"),
          max: $variant.data("max"),
          decimals: $variant.data("decimals"),
        });
        var $cofidis = $("#cofidis");
        if ($cofidis.length) {
          shoptet.cofidis.calculator(
            $(".price-final-holder:visible"),
            $cofidis
          );
        }
      }
    }
    if (typeof shoptet.products.checkDiscountFlag === "function") {
      shoptet.products.checkDiscountFlag();
    }
  }
  shoptet.variantsSimple = shoptet.variantsSimple || {};
  shoptet.scripts.libs.variantsSimple.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "variantsSimple");
  });
  shoptet.variantsSimple.loadedVariant = false;
})(shoptet);

(function (shoptet) {
  function handler() {
    shoptet.surcharges.initSurcharges();
    var selector =
      ".variant-list .hidden-split-parameter, .variant-list .split-parameter";
    var $splitParameters = $(selector);
    if ($splitParameters.length) {
      if (shoptet.variantsCommon.hasToDisableCartButton()) {
        shoptet.variantsCommon.disableAddingToCart();
      } else {
        shoptet.variantsCommon.enableAddingToCart();
      }
      $splitParameters.bind(
        "change ShoptetSelectedParametersReset",
        function (e) {
          shoptet.scripts.signalCustomEvent(
            "ShoptetSplitVariantParameterChange",
            e.target
          );
          shoptet.variantsSplit.showVariantDependent();
          shoptet.surcharges.updatePrices();
          hideMsg(true);
          var parameterValues = [];
          var parameterNames = [];
          var valueIsMissing = false;
          $splitParameters.each(function () {
            parameterNames.push($(this).attr("data-parameter-id"));
            var value = $("input:checked, option:selected", this).val();
            if ($.trim(value) === "") {
              valueIsMissing = true;
              shoptet.variantsCommon.reasonToDisable =
                shoptet.messages["chooseVariant"];
              $(this).parents(".variant-list").removeClass("variant-selected");
            } else {
              $(this).parents(".variant-list").addClass("variant-selected");
            }
            parameterValues.push(value);
          });
          if (!valueIsMissing) {
            var tempVariantCode = [];
            for (var i = 0; i < parameterValues.length; i++) {
              tempVariantCode.push(
                String(parameterNames[i]) + "-" + String(parameterValues[i])
              );
            }
            tempVariantCode.sort();
            var variantCode = tempVariantCode.join("-");
            shoptet.variantsCommon.disableAddingToCart();
            shoptet.variantsSplit.getData(variantCode);
          }
        }
      );
      if (
        $(
          "input:not(.variant-default):checked, option:not(.variant-default):selected",
          $splitParameters
        ).length
      ) {
        $splitParameters.trigger("change");
      }
    }
  }
  function getData(variantCode) {
    if (
      shoptet.variantsSplit.necessaryVariantData.hasOwnProperty(variantCode)
    ) {
      var data = shoptet.variantsSplit.necessaryVariantData[variantCode];
      var $form = $("#product-detail-form");
      var $formAmount = $("#product-detail-form .amount");
      $form.find("input[name=priceId]").val(data.id);
      shoptet.tracking.trackProducts($form[0], data.id, "ViewContent", [
        shoptet.tracking.trackFacebookPixel,
      ]);
      if (data.variantImage) {
        var replaceInfo = resolveImageFormat();
        shoptet.products.replaceImage(
          data.variantImage.big,
          data.variantImage[replaceInfo.format],
          replaceInfo.link
        );
      }
      if (data.isNotSoldOut) {
        shoptet.variantsCommon.enableAddingToCart();
        hideMsg();
      } else {
        shoptet.variantsCommon.reasonToDisable =
          shoptet.messages["unavailableVariant"];
        showMessage(
          shoptet.variantsCommon.reasonToDisable,
          "error",
          "",
          false,
          false
        );
      }
      $formAmount.val(
        shoptet.helpers.toLocaleFloat(
          data.minimumAmount,
          data.decimalCount,
          true
        )
      );
      $formAmount.data({
        min: data.minimumAmount,
        max: data.maximumAmount,
        decimals: data.decimalCount,
      });
      var $cofidis = $("#cofidis");
      if ($cofidis.length) {
        shoptet.cofidis.calculator($(".price-final-holder:visible"), $cofidis);
      }
      shoptet.scripts.signalCustomEvent("ShoptetVariantAvailable");
    } else {
      shoptet.variantsCommon.reasonToDisable =
        shoptet.messages["unavailableVariant"];
      showMessage(
        shoptet.messages["unavailableVariant"],
        "error",
        "",
        false,
        false
      );
      shoptet.scripts.signalCustomEvent("ShoptetVariantUnavailable");
    }
  }
  function showVariantDependent() {
    var parameterIds = [];
    var showDefault = false;
    $(
      ".variant-list .hidden-split-parameter, .variant-list .split-parameter"
    ).each(function () {
      var parameterId = this.id.replace("parameter-id-", "");
      var selected = $(this).find("input:checked, option:selected");
      var valueId = selected.val();
      if (valueId == "") {
        showDefault = true;
      } else {
        parameterIds.push(parameterId + "-" + valueId);
      }
    });
    $(
      ".p-detail-inner .parameter-dependent, .p-code .parameter-dependent"
    ).addClass(shoptet.variantsCommon.noDisplayClasses);
    var classToDisplay = "default-variant";
    if (!showDefault) {
      parameterIds.sort();
      classToDisplay = parameterIds.join("-");
    }
    $(
      ".p-detail-inner .parameter-dependent." +
        classToDisplay +
        ", .p-code .parameter-dependent." +
        classToDisplay
    ).removeClass(shoptet.variantsCommon.noDisplayClasses);
    if (typeof shoptet.products.checkDiscountFlag === "function") {
      shoptet.products.checkDiscountFlag();
    }
  }
  shoptet.variantsSplit = shoptet.variantsSplit || {};
  shoptet.scripts.libs.variantsSplit.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "variantsSplit");
  });
})(shoptet);

(function (shoptet) {
  function setupAllParameters(params) {
    var displayMessage = false;
    params.forEach(function (param) {
      displayMessage = shoptet.variantsUnavailable.setupCurrentParameter(
        document.getElementById(param),
        params,
        shoptet.variantsUnavailable.availableVariants
      );
    });
    var jsUnavailableCombinationMessage = document.getElementById(
      "jsUnavailableCombinationMessage"
    );
    if (jsUnavailableCombinationMessage) {
      if (displayMessage) {
        jsUnavailableCombinationMessage.classList.remove("no-display");
      } else {
        jsUnavailableCombinationMessage.classList.add("no-display");
      }
    }
  }
  function attachEventListeners(el, params) {
    var events = ["change", "ShoptetSelectedParametersReset"];
    events.forEach(function (event) {
      el.addEventListener(event, function () {
        shoptet.variantsUnavailable.setupAllParameters(params);
      });
    });
  }
  function getAvailableCombinations(variants, selected, currentParam) {
    var available = {};
    variants.forEach(function (variant) {
      var matches = true;
      for (var param in selected) {
        if (selected.hasOwnProperty(param)) {
          if (selected[param] === null || variant[param] === selected[param]) {
            continue;
          }
          matches = false;
          break;
        }
      }
      if (matches) {
        available[variant[currentParam]] = true;
      }
    });
    return available;
  }
  function getSelected(params, currentParam) {
    var selected = {};
    params.forEach(function (element) {
      if (element === currentParam) {
        return;
      }
      var val;
      var currentElement = document.getElementById(element);
      if (currentElement.tagName === "SELECT") {
        val = shoptet.common.getSelectValue(currentElement);
      } else {
        val = shoptet.common.getCheckedInputValue(currentElement)
          ? shoptet.common.getCheckedInputValue(currentElement)
          : "";
      }
      selected[element] = val === "" ? null : val;
    });
    return selected;
  }
  function getExistingOptions(el) {
    var existingOptions = [];
    if (el.tagName === "SELECT") {
      options = el.options;
    } else {
      options = el.querySelectorAll(".advanced-parameter");
    }
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (!option.getAttribute("data-choose")) {
        existingOptions.push(option);
      }
    }
    return existingOptions;
  }
  function getUnavailableOptgroup(el) {
    var unavailableOptgroup = el.querySelector(
      "." + shoptet.variantsUnavailable.classes.unavailableOptgroup
    );
    if (!unavailableOptgroup) {
      var optgroup = document.createElement("optgroup");
      optgroup.setAttribute(
        "label",
        shoptet.messages["unavailableCombination"]
      );
      optgroup.classList.add("unavailable-variants");
      el.append(optgroup);
      unavailableOptgroup = el.querySelector(
        "." + shoptet.variantsUnavailable.classes.unavailableOptgroup
      );
    }
    return unavailableOptgroup;
  }
  function handleOptions(el, available, existing) {
    for (var param in existing) {
      if (existing.hasOwnProperty(param)) {
        var option;
        if (el.tagName === "SELECT") {
          var unavailableOptgroup = shoptet.variantsUnavailable.getUnavailableOptgroup(
            el
          );
          option = existing[param];
        } else {
          option = existing[param].querySelector("input");
        }
        if (!available.hasOwnProperty(option.value)) {
          option.classList.add(
            shoptet.variantsUnavailable.classes.unavailableOption
          );
          if (el.tagName === "SELECT") {
            unavailableOptgroup.append(option);
          } else {
            option.parentElement.classList.add(
              shoptet.variantsUnavailable.classes.unavailableOptionWrapper
            );
          }
        } else {
          option.classList.remove(
            shoptet.variantsUnavailable.classes.unavailableOption
          );
          if (el.tagName === "SELECT") {
            shoptet.variantsUnavailable.moveOptionFromUnavailable(
              option,
              unavailableOptgroup
            );
          } else {
            option.parentElement.classList.remove(
              shoptet.variantsUnavailable.classes.unavailableOptionWrapper
            );
          }
        }
      }
    }
  }
  function getOption(el, param) {
    var selector, option;
    if (el.tagName === "SELECT") {
      selector = 'option[value="' + param + '"]';
      option = el.querySelector(selector);
    } else {
      selector = 'input[value="' + param + '"]';
      var input = el.querySelector(selector);
      option = input.parentNode;
    }
    return option;
  }
  function moveOptionFromUnavailable(option, unavailableOptgroup) {
    var options = unavailableOptgroup.querySelectorAll("option");
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === option.value) {
        var wrapper = unavailableOptgroup.parentNode;
        wrapper.insertBefore(option, unavailableOptgroup);
      }
    }
  }
  function areUnavailableOptionsSelected(unavailableOptions) {
    for (var i = 0; i < unavailableOptions.length; i++) {
      if (unavailableOptions[i].selected || unavailableOptions[i].checked) {
        return true;
      }
    }
    return false;
  }
  function setupCurrentParameter(el, params, variants) {
    var existingOptions = shoptet.variantsUnavailable.getExistingOptions(el);
    var currentParam = el.getAttribute("id");
    var selected = shoptet.variantsUnavailable.getSelected(
      params,
      currentParam
    );
    var available = shoptet.variantsUnavailable.getAvailableCombinations(
      variants,
      selected,
      currentParam
    );
    shoptet.variantsUnavailable.handleOptions(el, available, existingOptions);
    if (el.tagName === "SELECT") {
      var unavailableOptgroup = el.querySelector(
        "." + shoptet.variantsUnavailable.classes.unavailableOptgroup
      );
      if (!unavailableOptgroup) {
        return false;
      }
      if (!unavailableOptgroup.childElementCount) {
        unavailableOptgroup.parentNode.removeChild(unavailableOptgroup);
      }
      shoptet.variantsUnavailable.sortOptions(el);
    }
    var unavailableOptions = el.querySelectorAll(
      "." + shoptet.variantsUnavailable.classes.unavailableOption
    );
    if (unavailableOptions.length < 1) {
      return false;
    }
    return shoptet.variantsUnavailable.areUnavailableOptionsSelected(
      unavailableOptions
    );
  }
  function sortOptions(el) {
    var options = [];
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].parentNode.tagName === "SELECT") {
        options.push(el.options[i]);
      }
    }
    options.sort(function (a, b) {
      return a.getAttribute("data-index") - b.getAttribute("data-index");
    });
    options.forEach(function (option) {
      el.appendChild(option);
    });
    var optgroup = el.querySelector("optgroup");
    if (optgroup) {
      el.appendChild(optgroup);
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (
      typeof shoptet.variantsUnavailable.availableVariantsResource ===
      "undefined"
    ) {
      return;
    }
    shoptet.variantsUnavailable.availableVariants = [];
    for (
      var i = 0;
      i < shoptet.variantsUnavailable.availableVariantsResource.length;
      i++
    ) {
      var splitted = shoptet.variantsUnavailable.availableVariantsResource[
        i
      ].split("-");
      var currentVariant = {};
      (function () {
        for (var i = 0; i < splitted.length - 1; i++) {
          if (i % 2 === 0) {
            currentVariant["parameter-id-" + splitted[i]] = splitted[i + 1];
          }
        }
      })();
      shoptet.variantsUnavailable.availableVariants.push(currentVariant);
    }
    var params = [];
    var parametersHolders = document.getElementsByClassName(
      shoptet.variantsUnavailable.classes.parametersHolder
    );
    for (var el in parametersHolders) {
      if (parametersHolders.hasOwnProperty(el)) {
        params.push(parametersHolders[el].getAttribute("id"));
      }
    }
    shoptet.variantsUnavailable.setupAllParameters(params);
    params.forEach(function (el) {
      var optionsWrapper = document.getElementById(el);
      if (optionsWrapper.tagName === "SELECT") {
        shoptet.variantsUnavailable.attachEventListeners(
          optionsWrapper,
          params
        );
      } else {
        var inputs = optionsWrapper.querySelectorAll(
          ".advanced-parameter input"
        );
        for (var i = 0; i < inputs.length; i++) {
          shoptet.variantsUnavailable.attachEventListeners(inputs[i], params);
        }
      }
    });
    resetLink = document.getElementById("jsSplitVariantsReset");
    if (resetLink) {
      resetLink.addEventListener("click", function (e) {
        e.preventDefault();
        var parametersHolder = document.querySelectorAll(
          "." + shoptet.variantsUnavailable.classes.parametersHolder
        );
        for (var i = 0; i < parametersHolder.length; i++) {
          if (parametersHolder[i].tagName === "SELECT") {
            shoptet.scripts.signalCustomEvent(
              "ShoptetSelectedParametersReset",
              parametersHolder[i]
            );
            parametersHolder[i].options.selectedIndex = 0;
          } else {
            var defaultVariant = parametersHolder[i].querySelector(
              '[data-index="0"]'
            );
            defaultVariant.checked = true;
            var activeInput = parametersHolder[i].querySelector(
              'input:not([data-index="0"])'
            );
            shoptet.scripts.signalCustomEvent(
              "ShoptetSelectedParametersReset",
              activeInput
            );
          }
        }
      });
    }
  });
  shoptet.variantsUnavailable = shoptet.variantsUnavailable || {};
  shoptet.scripts.libs.variantsUnavailable.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "variantsUnavailable");
  });
  shoptet.variantsUnavailable.classes = {
    parametersHolder: "hidden-split-parameter",
    unavailableOptgroup: "unavailable-variants",
    unavailableOption: "unavailable-option",
    unavailableOptionWrapper: "unavailable-option-wrapper",
  };
})(shoptet);

(function (shoptet) {
  function makeAjaxRequest(url, type, data, callbacks, header) {
    return new Promise(function (resolve, reject) {
      if (typeof callbacks === "undefined") {
        callbacks = {};
      }
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open(type, url, true);
      if (header && header.hasOwnProperty("X-Shoptet-XHR")) {
        if (header["X-Shoptet-XHR"] === "Shoptet_Coo7ai") {
          xmlhttp.setRequestHeader("X-Shoptet-XHR", "Shoptet_Coo7ai");
        }
      }
      xmlhttp.onload = function () {
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
          var response = new AjaxResponse(xmlhttp.response);
          var allowedCallbacks = ["success", "failed", "redirect", "complete"];
          allowedCallbacks.forEach(function (callback) {
            response.setCallback(callback, function () {
              if (
                callbacks.hasOwnProperty(callback) &&
                typeof callbacks[callback] === "function"
              ) {
                callbacks[callback](response);
              }
            });
          });
          response.processResult();
          response.showNotification();
          resolve(response);
        } else {
          reject({ status: this.status, statusText: this.statusText });
        }
      };
      xmlhttp.onerror = function () {
        reject({ status: this.status, statusText: this.statusText });
      };
      xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      if (type === shoptet.ajax.requestTypes.post) {
        xmlhttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded; charset=UTF-8"
        );
      }
      xmlhttp.send(shoptet.common.serializeData(data));
    });
  }
  shoptet.ajax = shoptet.ajax || {};
  shoptet.ajax.makeAjaxRequest = makeAjaxRequest;
  shoptet.ajax.requestTypes = { get: "GET", post: "POST" };
  shoptet.ajax.pendingClass = "ajax-pending-element";
})(shoptet);

function AjaxResponse(result, customSettings) {
  this.R200_OK = 200;
  this.R301_REDIRECT = 301;
  this.R302_REDIRECT = 302;
  this.R303_REDIRECT = 303;
  this.R500_SERVER_ERROR = 500;
  this.settings = $.extend(
    { complete: null, success: null, failed: null, redirect: null },
    customSettings
  );
  try {
    if (typeof result === "object") {
      this.response = result;
    } else if (typeof result === "string") {
      this.response = JSON.parse(result);
    }
  } catch (e) {
    this.response = { code: this.R200_OK, message: null, payload: result };
  }
  return this;
}
AjaxResponse.prototype.setCallback = function (callback, fn) {
  if (typeof fn === "function") {
    this.settings[callback] = fn;
  } else {
    throw new Error("Argument is not a function");
  }
  return this;
};
AjaxResponse.prototype.isFailed = function () {
  return this.getCode() === this.R500_SERVER_ERROR;
};
AjaxResponse.prototype.isSuccess = function () {
  return this.getCode() === this.R200_OK;
};
AjaxResponse.prototype.isRedirected = function () {
  return (
    this.getFromPayload("returnUrl") !== null &&
    (this.getCode() === this.R301_REDIRECT ||
      this.getCode() === this.R302_REDIRECT ||
      this.getCode() === this.R303_REDIRECT)
  );
};
AjaxResponse.prototype.redirect = function () {
  if (this.isRedirected()) {
    location.replace(this.getFromPayload("returnUrl"));
  }
  return false;
};
AjaxResponse.prototype.getCode = function () {
  return this.response.code;
};
AjaxResponse.prototype.getMessage = function () {
  return this.response.message;
};
AjaxResponse.prototype.getPayload = function () {
  return this.response.payload;
};
AjaxResponse.prototype.getFromPayload = function (key) {
  var payload = this.getPayload();
  if (payload === null) {
    return null;
  }
  if (payload.hasOwnProperty(key)) {
    return payload[key];
  }
  return null;
};
AjaxResponse.prototype.showNotification = function () {
  var message = this.getMessage();
  if (!message) {
    return false;
  }
  if (this.isFailed()) {
    showMessage(message, "error");
  } else {
    showMessage(message, "success");
  }
  return this;
};
AjaxResponse.prototype.processResult = function () {
  var callback;
  if (this.isFailed()) {
    callback = this.settings.failed;
  } else if (this.isRedirected()) {
    this.redirect();
    callback = this.settings.redirect;
  } else {
    callback = this.settings.success;
  }
  if (typeof callback === "function") {
    callback(this.getCode(), this.getMessage(), this.getPayload());
  }
  if (typeof this.settings.complete === "function") {
    this.settings.complete(
      this.getCode(),
      this.getMessage(),
      this.getPayload()
    );
  }
};

(function (shoptet) {
  function updateCartButton(count, price) {
    var $cartWrapper = $(".place-cart-here");
    var $cartButton = $("#header .cart-count");
    var $priceHolder = $cartButton.find(".cart-price");
    var $overviewWrapper = $(".cart-overview");
    if (count > 0) {
      $cartWrapper.addClass("full");
      var i = $cartButton.find("i");
      if (parseFloat(count) > 0) {
        if (count > 99) {
          count = "99+";
        } else {
          count = Math.round(parseFloat(count));
        }
        if (i.length) {
          i.text(count);
        } else {
          $cartButton.append("<i>" + count + "</i>").addClass("full");
        }
        if ($priceHolder.length) {
          $priceHolder.text(price);
        }
      }
    } else {
      $cartWrapper.removeClass("full");
      $cartButton.removeClass("full").find("i").remove();
      if ($priceHolder.length) {
        $priceHolder.text(shoptet.messages["emptyCart"]);
      }
    }
    if ($overviewWrapper.length) {
      $overviewWrapper.find(".cart-overview-item-count").text(count);
      $overviewWrapper.find(".cart-overview-final-price").text(price);
    }
    shoptet.scripts.signalDomUpdate("ShoptetDOMCartCountUpdated");
  }
  function getCartContent(hide, callback) {
    var cartUrlSuffix = "";
    if (shoptet.config.orderingProcess.active) {
      cartUrlSuffix += "?orderingProcessActive=1";
    }
    if (
      shoptet.abilities.feature.simple_ajax_cart &&
      $("body").hasClass("cart-window-visible")
    ) {
      cartUrlSuffix += cartUrlSuffix.indexOf("?") !== -1 ? "&" : "?";
      cartUrlSuffix += "simple_ajax_cart=1";
    }
    var el, $cartContentWrapper;
    if ($("#cart-wrapper").length) {
      el = "#cart-wrapper";
      $cartContentWrapper = $(el).parent();
    } else {
      el = ".place-cart-here";
      $cartContentWrapper = $(el);
    }
    var successCallback = function (response) {
      $cartContentWrapper.html(response.getFromPayload("content"));
      $(el + " img").unveil();
      initColorbox();
      initTooltips();
      if (hide !== false) {
        hideSpinner();
      }
      if (typeof callback === "function") {
        callback();
      }
      shoptet.scripts.signalDomLoad("ShoptetDOMCartContentLoaded");
    };
    shoptet.ajax.makeAjaxRequest(
      shoptet.config.cartContentUrl + cartUrlSuffix,
      shoptet.ajax.requestTypes.get,
      "",
      { success: successCallback },
      { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
    );
  }
  function getAdvancedOrder() {
    var successCallback = function (response) {
      var content = response.getFromPayload("content");
      if (content !== false) {
        shoptet.modal.open({
          html:
            shoptet.content.colorboxHeader +
            content +
            shoptet.content.colorboxFooter,
          width: shoptet.config.colorbox.widthLg,
          className: shoptet.config.colorbox.classLg,
          onComplete: function () {
            $(".colorbox-html-content img").unveil();
            $("body").removeClass(shoptet.config.bodyClasses);
            if ($(".overlay").length > 0) {
              $(".overlay").detach();
            }
            shoptet.scripts.signalDomLoad("ShoptetDOMAdvancedOrderLoaded");
          },
        });
      }
    };
    shoptet.ajax.makeAjaxRequest(
      shoptet.config.advancedOrderUrl,
      shoptet.ajax.requestTypes.get,
      "",
      { success: successCallback },
      { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
    );
  }
  function functionsForCart(form, response) {
    shoptet.tracking.handleAction(form, response);
    if (
      typeof shoptet.config.showAdvancedOrder !== "undefined" &&
      !shoptet.config.orderingProcess.active
    ) {
      shoptet.cart.getAdvancedOrder();
    }
  }
  function functionsForStep1() {
    shoptet.checkout.getStatedValues();
    shoptet.checkout.setFirstPossibleShippingAndBilling();
    shoptet.checkout.setActiveShippingAndPayments();
    shoptet.checkout.payu();
  }
  function handleCartPostUpdate(action, el) {
    initTooltips();
    shoptet.scripts.signalCustomEvent(
      shoptet.common.createEventNameFromFormAction(action),
      el
    );
    shoptet.scripts.signalCustomEvent("ShoptetCartUpdated", el);
  }
  function ajaxSubmitForm(
    action,
    form,
    callingFunctions,
    replaceContent,
    displaySpinner
  ) {
    var body = document.getElementsByTagName("body")[0];
    if (displaySpinner === true) {
      showSpinner();
    }
    var cartUrlSuffix = "";
    if (
      shoptet.abilities.feature.simple_ajax_cart &&
      !shoptet.config.orderingProcess.active
    ) {
      cartUrlSuffix = "?simple_ajax_cart=1";
      body.classList.add("ajax-pending");
    }
    var completeCallback = function () {
      if (typeof shoptet.content.addToNotifier !== "undefined") {
        if (response.response.code !== 500) {
          response.response.message += " " + shoptet.content.addToNotifier;
        }
        delete shoptet.content.addToNotifier;
      }
      body.classList.remove("ajax-pending");
    };
    var successCallback = function (response) {
      switch (replaceContent) {
        case "cart":
          shoptet.cart.updateCartButton(
            response.getFromPayload("count"),
            response.getFromPayload("price")
          );
          if (
            shoptet.config.orderingProcess.step === 0 ||
            body.classList.contains("cart-window-visible")
          ) {
            if (callingFunctions === "functionsForCart") {
              var cartCallback = function () {
                shoptet.cart.functionsForCart(form, response);
                shoptet.cart.handleCartPostUpdate(action, document);
              };
            }
            shoptet.cart.getCartContent(true, cartCallback);
          } else {
            delete shoptet.events.cartLoaded;
            setTimeout(function () {
              hideSpinner();
            }, shoptet.config.dismissTimeout);
            hideSpinner();
          }
          break;
        case true:
          var payloadContent = $(payload.content).find("#content-wrapper");
          payloadContent.find("#toplist").remove();
          $("#content-wrapper").replaceWith(payloadContent);
          $("#content-wrapper img").unveil();
          initColorbox();
          shoptet.modal.shoptetResize();
          shoptet.scripts.signalDomLoad("ShoptetDOMPageContentLoaded");
          break;
      }
      dismissMessages();
      if (
        callingFunctions === "functionsForCart" &&
        typeof cartCallback === "undefined"
      ) {
        shoptet.cart.functionsForCart(form, response);
      }
      if (callingFunctions === "functionsForStep1") {
        shoptet.cart.functionsForStep1();
      }
      if (typeof cartCallback === "undefined") {
        shoptet.cart.handleCartPostUpdate(action, form);
      }
    };
    var failedCallback = function (response) {
      hideSpinner();
      $("html, body").animate(
        { scrollTop: 0 },
        shoptet.config.animationDuration
      );
      if (callingFunctions === "functionsForCart") {
        if (
          shoptet.config.orderingProcess.step === 0 ||
          body.classList.contains("cart-window-visible")
        ) {
          var cartCallback = function () {
            shoptet.cart.functionsForCart(form, response);
          };
          shoptet.cart.getCartContent(true, cartCallback);
        } else {
          delete shoptet.events.cartLoaded;
          shoptet.cart.functionsForCart(form, response);
        }
      }
    };
    shoptet.ajax.makeAjaxRequest(
      action + cartUrlSuffix,
      shoptet.ajax.requestTypes.post,
      shoptet.common.serializeForm(form),
      {
        success: successCallback,
        failed: failedCallback,
        complete: completeCallback,
      },
      { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
    );
    return false;
  }
  function updateQuantityInCart($input, timeout) {
    clearTimeout(shoptet.runtime.setPcsTimeout);
    var $parentForm = $input.parents("form");
    var displaySpinner = true;
    if (
      !shoptet.abilities.feature.extended_ajax_cart &&
      $("body").hasClass("user-action-visible")
    ) {
      displaySpinner = false;
    }
    shoptet.runtime.setPcsTimeout = setTimeout(function () {
      shoptet.cart.ajaxSubmitForm(
        $parentForm.attr("action"),
        $parentForm[0],
        "functionsForCart",
        "cart",
        displaySpinner
      );
    }, timeout);
  }
  function removeItemFromCart($el) {
    var $parentForm = $el.parents("form");
    var displaySpinner = true;
    if (
      !shoptet.abilities.feature.extended_ajax_cart &&
      $("body").hasClass("user-action-visible")
    ) {
      displaySpinner = false;
    }
    shoptet.cart.ajaxSubmitForm(
      $parentForm.attr("action"),
      $parentForm[0],
      "functionsForCart",
      "cart",
      displaySpinner
    );
  }
  function toggleRelatedProducts($target) {
    $target.toggleClass("visible");
    $target.prev("tr").toggleClass("related-visible");
  }
  document.addEventListener("DOMContentLoaded", function () {
    var $html = $("html");
    $html.on("change", "input.amount", function () {
      if (
        $(this).parents(".cart-table").length ||
        $(this).parents(".cart-widget-product-amount").length
      ) {
        shoptet.cart.updateQuantityInCart(
          $(this),
          shoptet.config.updateQuantityTimeout
        );
      }
    });
    $html.on("submit", ".quantity-form", function (e) {
      e.preventDefault();
      shoptet.cart.updateQuantityInCart(
        $(this).find("input.amount"),
        shoptet.config.updateQuantityTimeout
      );
      return false;
    });
    $html.on("click", ".show-related", function (e) {
      e.preventDefault();
      var $tr = $(this).parents("tr").next(".related");
      shoptet.cart.toggleRelatedProducts($tr);
      $tr.find("img").unveil();
    });
    $html.on("click touchend", "#continue-order-button", function (e) {
      if ($("#discountCouponCode").val()) {
        showMessage(
          shoptet.messages["discountCouponWarning"],
          "warning",
          "",
          false,
          true
        );
        e.preventDefault();
      } else {
        window.location = $(this).attr("href");
      }
    });
    $html.on("click", ".free-gift-trigger", function (e) {
      e.preventDefault();
      $(".free-gifts-wrapper img").each(function () {
        $(this).attr("src", $(this).attr("data-src"));
      });
      var content = $(".free-gifts-wrapper").html();
      shoptet.modal.open({
        html:
          shoptet.content.colorboxHeader +
          content +
          shoptet.content.colorboxFooter,
        width: shoptet.config.colorbox.widthSm,
        maxHeight: "95%",
        className: shoptet.config.colorbox.classSm,
      });
      $("#colorbox input").remove();
    });
    $html.on("click", ".remove-item", function (e) {
      e.preventDefault();
      $el = $(this);
      shoptet.cart.removeItemFromCart($el);
    });
    $html.on("click", "#colorbox .free-gifts label", function (e) {
      e.preventDefault();
      var id = $(this).attr("for");
      $(".free-gifts input").each(function () {
        if (id == $(this).attr("id")) {
          $(this).prop("checked", true);
        } else {
          $(this).prop("checked", false);
        }
      });
      shoptet.modal.close();
      var $form = $(".free-gifts-wrapper form");
      shoptet.cart.ajaxSubmitForm(
        $form.attr("action"),
        $form[0],
        "functionsForCart",
        "cart",
        true
      );
    });
    $html.on("submit", "form.pr-action, form.variant-submit", function (e) {
      e.preventDefault();
      if (shoptet.variantsCommon.handleSubmit($(this))) {
        var $this = $(this);
        var $amount = $this.find(".amount");
        var decimals = $amount.data("decimals") || 0;
        var max =
          shoptet.helpers.toFloat($amount.data("max")) ||
          shoptet.config.defaultProductMaxAmount;
        var min =
          shoptet.helpers.toFloat($amount.data("min")) ||
          shoptet.helpers.resolveMinimumAmount(decimals);
        var value = $amount.length ? shoptet.helpers.toFloat($amount.val()) : 1;
        if (value > max) {
          $amount.val(shoptet.helpers.toLocaleFloat(max, decimals, true));
          shoptet.content.addToNotifier = shoptet.messages["amountChanged"];
        }
        if (value < min) {
          $amount.val(shoptet.helpers.toLocaleFloat(min, decimals, true));
          shoptet.content.addToNotifier = shoptet.messages["amountChanged"];
        }
        shoptet.cart.ajaxSubmitForm(
          $this.attr("action"),
          $this[0],
          "functionsForCart",
          "cart",
          true
        );
      }
    });
    $html.on("submit", ".discount-coupon form", function (e) {
      e.preventDefault();
      var $this = $(this);
      shoptet.cart.ajaxSubmitForm(
        $this.attr("action"),
        $this[0],
        "functionsForCart",
        "cart",
        true
      );
    });
    var $additionalInformation = $("#additionalInformation");
    if (
      $additionalInformation.length &&
      !$additionalInformation.hasClass("visible")
    ) {
      toggleRequiredAttributes($additionalInformation, "remove", false);
    }
    var $shippingAddress = $("#shipping-address");
    if ($shippingAddress.length && !$shippingAddress.hasClass("visible")) {
      toggleRequiredAttributes($shippingAddress, "remove", false);
    }
    var $companyInfo = $("#company-info");
    if ($companyInfo.length && !$companyInfo.hasClass("visible")) {
      toggleRequiredAttributes($companyInfo, "remove", false);
    }
    $html.on("change", 'input[name="customerGroupId"]', function () {
      var $additionalInformation = $("#additionalInformation");
      if ($(this).hasClass("show-full-profile")) {
        if (!$additionalInformation.hasClass("visible")) {
          $additionalInformation.addClass("visible");
          if ($(this).hasClass("is-wholesale")) {
            if (!$("#company-shopping").parent().hasClass("unveiled")) {
              $("#company-shopping").trigger("click");
            }
            $("#company-shopping").parent().hide();
            toggleRequiredAttributes($companyInfo, "add", false);
          } else {
            $("#company-shopping").parent().show();
            toggleRequiredAttributes($companyInfo, "remove", false);
          }
          toggleRequiredAttributes($additionalInformation, "add", true);
        }
      } else {
        if ($additionalInformation.hasClass("visible")) {
          $additionalInformation.removeClass("visible");
          toggleRequiredAttributes($additionalInformation, "remove", true);
        }
      }
    });
    $html.on("change", "#company-shopping", function () {
      if (!$companyInfo.hasClass("visible")) {
        toggleRequiredAttributes($companyInfo, "remove", false);
      } else {
        toggleRequiredAttributes($companyInfo, "add", false);
      }
    });
    $html.on("change", "#another-shipping", function () {
      shoptet.checkout.toggleAnotherShipping();
    });
    var $anotherShipping = $("#another-shipping");
    if (
      $anotherShipping.length &&
      $anotherShipping[0].hasAttribute("data-change")
    ) {
      $anotherShipping.prop("checked", true);
      shoptet.checkout.toggleAnotherShipping(false);
    }
  });
  shoptet.cart = shoptet.cart || {};
  shoptet.scripts.libs.cart.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "cart");
  });
})(shoptet);

(function (shoptet) {
  function addToCart(payload, silent) {
    if (typeof payload !== "object") {
      shoptet.scripts.signalCustomEvent("ShoptetCartAddCartItemFailed");
      throw new Error("Invalid function arguments");
    }
    var form = document.createElement("form");
    form.setAttribute("action", shoptet.config.addToCartUrl);
    for (var key in payload) {
      if (typeof payload[key] === "object") {
        for (var j in payload[key]) {
          var input = document.createElement("input");
          input.setAttribute("name", key + "[" + j + "]");
          input.setAttribute("value", payload[key][j]);
          form.appendChild(input);
        }
      } else {
        var input = document.createElement("input");
        input.setAttribute("name", key);
        input.setAttribute("value", payload[key]);
        form.appendChild(input);
      }
    }
    if (typeof silent !== "undefined" && silent) {
      var completeCallback = function (response) {
        console.log(response.response);
      };
      cartUrlSuffix = "?simple_ajax_cart=1";
      shoptet.ajax.makeAjaxRequest(
        shoptet.config.addToCartUrl + cartUrlSuffix,
        shoptet.ajax.requestTypes.post,
        shoptet.common.serializeForm(form),
        { complete: completeCallback },
        { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
      );
    } else {
      if (shoptet.abilities.about.generation !== 3) {
        ajaxAddToCart(shoptet.config.addToCartUrl, form);
      } else {
        shoptet.cart.ajaxSubmitForm(
          shoptet.config.addToCartUrl,
          form,
          "functionsForCart",
          "cart",
          true
        );
      }
    }
  }
  shoptet.cartShared = shoptet.cartShared || {};
  shoptet.scripts.libs.cartShared.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "cartShared");
  });
})(shoptet);

function toggleRequiredAttributes($el, job, preserveNoJsValidation) {
  if (job === "remove") {
    $('[autocomplete="email"]').attr("autocomplete", "new-email");
    $.each($el.find(":required"), function () {
      $(this).removeAttr("required").attr("data-required", "required");
      $(this).addClass("js-validate");
    });
    $.each($el.find(".js-validate"), function () {
      shoptet.validator.removeErrorMessage(this, this.parentElement);
      $(this)
        .addClass("js-validation-suspended")
        .removeClass("js-error-field")
        .attr("data-original-value", $(this).val())
        .attr("data-original-autocomplete", $(this).attr("autocomplete"))
        .attr("autocomplete", "autocomplete-off")
        .val("");
    });
    if (!preserveNoJsValidation) {
      $.each($el.find("[data-disabled-validation]"), function () {
        $(this).addClass("no-js-validation");
        $(this).removeAttr("data-disabled-validation");
      });
    }
  } else {
    $('[autocomplete="new-email"]').attr("autocomplete", "email");
    $.each($el.find("[data-required]"), function () {
      $(this).removeAttr("data-required").attr("required", "required");
    });
    $.each($el.find(".js-validation-suspended"), function () {
      $(this)
        .removeClass("js-validation-suspended")
        .attr("autocomplete", $(this).attr("data-original-autocomplete"))
        .val($(this).attr("data-original-value"))
        .removeAttr("data-original-autocomplete")
        .removeAttr("data-original-value");
    });
    if (!preserveNoJsValidation) {
      $.each($el.find(".no-js-validation"), function () {
        $(this).removeClass("no-js-validation");
        $(this).attr("data-disabled-validation", true);
      });
    }
  }
}

(function (shoptet) {
  function initNewValidator(validator, element, event) {
    element.addEventListener(event, function () {
      validator(element);
    });
  }
  function formContainsInvalidFields(form) {
    return form.querySelectorAll(shoptet.validator.invalidFieldClasses).length;
  }
  function handleValidators(validators) {
    Object.keys(validators).forEach(function (key) {
      var currentValidator = validators[key];
      for (var innerKey in currentValidator["elements"]) {
        if (typeof currentValidator["elements"][innerKey] === "object") {
          currentValidator["events"].forEach(function (event, index) {
            shoptet.validator.initNewValidator(
              currentValidator["validator"],
              currentValidator["elements"][innerKey],
              event
            );
            if (currentValidator["fireEvent"]) {
              if (!(currentValidator["fireOneEvent"] && index > 0)) {
                if (
                  shoptet.scripts.availableCustomEvents.indexOf(event) !== -1
                ) {
                  shoptet.scripts.signalCustomEvent(
                    event,
                    currentValidator["elements"][innerKey]
                  );
                } else {
                  shoptet.scripts.signalNativeEvent(
                    event,
                    currentValidator["elements"][innerKey]
                  );
                }
              }
            }
          });
        }
      }
    });
  }
  function getExistingMessage(element) {
    var parent = element.parentElement;
    var messageClass = ".js-validator-msg";
    return parent.querySelectorAll(messageClass);
  }
  function removeErrorMessage(element, elementWrapper, messageType) {
    var messageClass = "js-error-field";
    var existingMessage = shoptet.validator.getExistingMessage(elementWrapper);
    if (existingMessage.length) {
      for (var i = 0; i < existingMessage.length; i++) {
        if (typeof messageType === "undefined") {
          existingMessage[i].parentNode.removeChild(existingMessage[i]);
          element.classList.remove(messageClass);
        } else {
          if (existingMessage[i].dataset.type === messageType) {
            existingMessage[i].parentNode.removeChild(existingMessage[i]);
            element.classList.remove(messageClass);
          }
        }
      }
    }
  }
  function addErrorMessage(element, elementWrapper, messageType) {
    shoptet.validator.removeErrorMessage(element, elementWrapper);
    element.classList.add("js-error-field");
    var message = document.createElement("div");
    message.classList.add("js-validator-msg");
    message.classList.add("msg-error");
    message.setAttribute("data-type", messageType);
    message.innerHTML = shoptet.messages[messageType];
    elementWrapper.parentElement.insertBefore(message, elementWrapper);
  }
  document.addEventListener("DOMContentLoaded", function () {
    var oldValidationIsStillInUse = true;
    if (!oldValidationIsStillInUse) {
      var forms = document.getElementsByTagName("form");
      for (var key in forms) {
        if (typeof forms[key] === "object") {
          forms[key].addEventListener("submit", function (form) {
            formContainsInvalidFields(form);
          });
        }
      }
    }
  });
  document.addEventListener("change", function (e) {
    if (
      e.target &&
      e.target.matches('input[type="text"], input[type="email"]')
    ) {
      e.target.value = e.target.value.trim();
    }
  });
  shoptet.validator = shoptet.validator || {};
  shoptet.scripts.libs.validator.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "validator");
  });
  shoptet.validator.invalidFieldClasses =
    ".js-error-field, .js-validated-field";
  shoptet.validator.events = ["DOMContentLoaded", "ShoptetDOMContentLoaded"];
})(shoptet);

(function (shoptet) {
  function validateNumber(el) {
    if (el.classList.contains("js-validation-suspended")) {
      return true;
    }
    el.classList.add("js-validated-field");
    
    var validatedValue = el.value.replace(/[^0-9|'+']/g, "");
    if (validatedValue.indexOf("+") !== -1) {
      for (var i = 3; i > 0; i--) {
        var phoneCode = validatedValue.substr(1, i);
        if (!phoneCode.match(/^\d+$/)) {
          continue;
        }
        if (shoptet.phoneInput.phoneCodes.indexOf(parseInt(phoneCode)) !== -1) {
          var activeFlag = el.parentElement.querySelector(
            ".country-flag.selected"
          );
          var flag = el.parentElement.querySelector(
            '.country-flag[data-dial="' + phoneCode + '"]'
          );
          if (flag) {
            if (activeFlag.getAttribute("data-dial") !== phoneCode) {
              shoptet.phoneInput.setSelectedCountry(
                flag,
                flag.parentElement.parentElement,
                false
              );
            }
            validatedValue = validatedValue.substring(i + 1);
            el.value = validatedValue;
            break;
          }
        }
      }
    }
    var phoneWrapper = el.parentElement;
    var phoneInfo = {};
    var phoneInfoEl = phoneWrapper.querySelector(".js-phone-code");
    try {
      phoneInfo = JSON.parse(phoneInfoEl.value);
    } catch (e) {
      el.classList.remove("js-validated-field");
      el.removeAttribute("disabled");
      return false;
    }
    if (validatedValue.length === 0 && el.value.length !== 0) {
      shoptet.validator.addErrorMessage(
        el,
        phoneWrapper,
        shoptet.validatorPhone.messageType
      );
      el.classList.remove("js-validated-field");
      el.removeAttribute("disabled");
      return false;
    }
    if (!validatedValue.length) {
      shoptet.validator.removeErrorMessage(
        el,
        phoneWrapper,
        shoptet.validatorPhone.messageType
      );
      el.classList.remove("js-validated-field");
      el.removeAttribute("disabled");
      return true;
    }
    if (
      ++shoptet.validatorPhone.ajaxPending >
      shoptet.validatorPhone.validators.phoneInputs.elements.length
    ) {
      shoptet.validatorPhone.ajaxPending--;
      return;
    }
    var successCallback = function (response) {
      if (response.getFromPayload("isValidForRegion")) {
        el.value = response.getFromPayload("nationalNumber");
        shoptet.validator.removeErrorMessage(
          el,
          phoneWrapper,
          shoptet.validatorPhone.messageType
        );
        shoptet.validator.removeErrorMessage(
          el,
          phoneWrapper,
          shoptet.validatorRequired.messageType
        );
      } else {
        shoptet.validator.addErrorMessage(
          el,
          phoneWrapper,
          shoptet.validatorPhone.messageType
        );
        shoptet.scripts.signalCustomEvent("ShoptetValidationError", el);
      }
      el.classList.remove("js-validated-field");
      el.removeAttribute("disabled");
      shoptet.validatorPhone.ajaxPending--;
    };
    var failedCallback = function () {
      el.classList.remove("js-validated-field");
      el.removeAttribute("disabled");
      shoptet.validatorPhone.ajaxPending--;
    };
    var url = shoptet.validatorPhone.validateUrl;
    url +=
      "?number=" +
      encodeURIComponent(validatedValue) +
      "&phoneCode=" +
      encodeURIComponent(phoneInfo.phoneCode) +
      "&countryCode=" +
      encodeURIComponent(phoneInfo.countryCode);
    shoptet.ajax
      .makeAjaxRequest(
        url,
        shoptet.ajax.requestTypes.get,
        "",
        { success: successCallback, failed: failedCallback },
        { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
      )
      .then(function () {
        if (shoptet.validatorPhone.ajaxPending === 0) {
          document.dispatchEvent(
            new Event(shoptet.validatorPhone.ajaxDoneEvent)
          );
        }
      });
  }
  shoptet.validatorPhone = shoptet.validatorPhone || {};
  shoptet.scripts.libs.validatorPhone.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "validatorPhone");
  });
  shoptet.validatorPhone.validateUrl = "/action/ShoptetValidatePhone/index/";
  shoptet.validatorPhone.messageType = "validatorInvalidPhoneNumber";
  shoptet.validatorPhone.validators = {
    phoneInputs: {
      elements: document.getElementsByClassName("js-validate-phone"),
      events: ["change", "ShoptetPhoneCodeChange"],
      validator: shoptet.validatorPhone.validateNumber,
      fireEvent: true,
      fireOneEvent: true,
    },
  };
  shoptet.validatorPhone.ajaxPending = 0;
  shoptet.validatorPhone.ajaxDoneEvent = "ShoptetAjaxValidationDone";
  for (var i = 0; i < shoptet.validator.events.length; i++) {
    document.addEventListener(shoptet.validator.events[i], function () {
      shoptet.validator.handleValidators(shoptet.validatorPhone.validators);
    });
  }
})(shoptet);

(function (shoptet) {
  function validateZipCode(el) {
    if (el.classList.contains("js-validation-suspended")) {
      return true;
    }
    var validatedValue = el.value.trim();
    el.value = validatedValue;
    var validPattern = el.getAttribute("data-pattern");
    var elWrapper = el.parentElement;
    var regex = validPattern ? new RegExp(validPattern, "i") : false;
    if (regex && validatedValue && !regex.test(validatedValue)) {
      shoptet.validator.addErrorMessage(
        el,
        elWrapper,
        shoptet.validatorZipCode.messageType
      );
      shoptet.scripts.signalCustomEvent("ShoptetValidationError", el);
    } else {
      shoptet.validator.removeErrorMessage(
        el,
        elWrapper,
        shoptet.validatorZipCode.messageType
      );
    }
  }
  function updateZipValidPattern($el) {
    if ($el.attr("id") === "billCountryId") {
      $("#billZip").attr(
        "data-pattern",
        $el.find("option:selected").data("zip-code-pattern")
      );
      shoptet.scripts.signalCustomEvent(
        "ShoptetBillZipPatternChange",
        $("#billZip")[0]
      );
    } else if ($el.attr("id") === "deliveryCountryId") {
      $("#deliveryZip").attr(
        "data-pattern",
        $el.find("option:selected").data("zip-code-pattern")
      );
      shoptet.scripts.signalCustomEvent(
        "ShoptetDeliveryZipPatternChange",
        $("#deliveryZip")[0]
      );
    }
  }
  shoptet.validatorZipCode = shoptet.validatorZipCode || {};
  shoptet.scripts.libs.validatorZipCode.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "validatorZipCode");
  });
  shoptet.validatorZipCode.messageType = "validatorZipCode";
  shoptet.validatorZipCode.validators = {
    zipCodeInputs: {
      elements: document.getElementsByClassName("js-validate-zip-code"),
      events: [
        "change",
        "ShoptetBillZipPatternChange",
        "ShoptetDeliveryZipPatternChange",
      ],
      validator: shoptet.validatorZipCode.validateZipCode,
      fireEvent: true,
      fireOneEvent: true,
    },
  };
  for (var i = 0; i < shoptet.validator.events.length; i++) {
    document.addEventListener(shoptet.validator.events[i], function () {
      shoptet.validator.handleValidators(shoptet.validatorZipCode.validators);
    });
  }
})(shoptet);

(function (shoptet) {
  function validateCompanyId(el) {
    if (el.classList.contains("js-validation-suspended")) {
      return true;
    }
    var validatedValue = el.value.trim();
    var validPattern = el.getAttribute("data-pattern");
    var elWrapper = el.parentElement;
    var regex = validPattern ? new RegExp(validPattern, "i") : false;
    if (regex && validatedValue && !regex.test(validatedValue)) {
      shoptet.validator.addErrorMessage(
        el,
        elWrapper,
        shoptet.validatorCompanyId.messageTypeCustomized
      );
      shoptet.scripts.signalCustomEvent("ShoptetValidationError", el);
    } else {
      shoptet.validator.removeErrorMessage(
        el,
        elWrapper,
        shoptet.validatorCompanyId.messageTypeCustomized
      );
    }
  }
  function updateCompanyIdValidPattern() {
    var currentOption = $("#billCountryId").find("option:selected");
    if (currentOption.length) {
      $("#companyId").attr(
        "data-pattern",
        currentOption.data("company-id-pattern")
      );
      shoptet.messages[
        shoptet.validatorCompanyId.messageTypeCustomized
      ] = shoptet.messages[shoptet.validatorCompanyId.messageType].replace(
        "%1",
        currentOption.data("company-id-example")
      );
      shoptet.scripts.signalCustomEvent(
        "ShoptetCompanyIdPatternChange",
        $("#companyId")[0]
      );
    }
  }
  shoptet.validatorCompanyId = shoptet.validatorCompanyId || {};
  shoptet.scripts.libs.validatorCompanyId.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "validatorCompanyId");
  });
  shoptet.validatorCompanyId.messageType = "validatorInvalidCompanyId";
  shoptet.validatorCompanyId.messageTypeCustomized =
    "validatorInvalidCompanyIdCustomized";
  shoptet.validatorCompanyId.validators = {
    companyIdInputs: {
      elements: document.getElementsByClassName("js-validate-company-id"),
      events: ["ShoptetCompanyIdPatternChange", "change"],
      validator: shoptet.validatorCompanyId.validateCompanyId,
      fireEvent: true,
      fireOneEvent: true,
    },
  };
  document.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector(".js-validate-company-id");
    if (input) {
      shoptet.validatorCompanyId.updateCompanyIdValidPattern();
    }
  });
  for (var i = 0; i < shoptet.validator.events.length; i++) {
    document.addEventListener(shoptet.validator.events[i], function () {
      shoptet.validator.handleValidators(shoptet.validatorCompanyId.validators);
    });
  }
})(shoptet);

(function (shoptet) {
  function validateRequiredField(el) {
    if (el.classList.contains("js-validation-suspended")) {
      return true;
    }
    if (!el.value.length && !el.classList.contains("no-js-validation")) {
      var phoneWrapper = el.parentElement;
      shoptet.validator.addErrorMessage(
        el,
        phoneWrapper,
        shoptet.validatorRequired.messageType
      );
      shoptet.scripts.signalCustomEvent("ShoptetValidationError", el);
    } else {
      phoneWrapper = el.parentElement;
      shoptet.validator.removeErrorMessage(
        el,
        phoneWrapper,
        shoptet.validatorRequired.messageType
      );
    }
  }
  shoptet.validatorRequired = shoptet.validatorRequired || {};
  shoptet.scripts.libs.validatorRequired.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "validatorRequired");
  });
  shoptet.validatorRequired.messageType = "validatorRequired";
  shoptet.validatorRequired.validators = {
    requiredInputs: {
      elements: document.getElementsByClassName("js-validate-required"),
      events: ["change", "blur", "validatedFormSubmit"],
      validator: shoptet.validatorRequired.validateRequiredField,
      fireEvent: false,
    },
  };
  for (var i = 0; i < shoptet.validator.events.length; i++) {
    document.addEventListener(shoptet.validator.events[i], function () {
      shoptet.validator.handleValidators(shoptet.validatorRequired.validators);
    });
  }
})(shoptet);

(function (shoptet) {
  function handleFlags(el) {
    el.addEventListener("keyup", function (e) {
      shoptet.phoneInput.handleKeyCodes(e, el);
    });
    var flagsEl = el.getElementsByClassName("country-flag");
    for (var key in flagsEl) {
      if (typeof flagsEl[key] === "object") {
        var parentGroup = flagsEl[key].parentElement.parentElement;
        (function (flag, parentGroup) {
          flag.addEventListener("click", function (e) {
            e.stopPropagation();
            parentGroup.focus();
            if (parentGroup.classList.contains("active")) {
              shoptet.phoneInput.hideCountriesSelect(parentGroup);
            } else {
              parentGroup.classList.add("active");
              shoptet.phoneInput.positionCountriesSelect(parentGroup);
              shoptet.scripts.signalCustomEvent(
                "ShoptetPhoneCodeActive",
                parentGroup
              );
            }
            if (!flag.classList.contains("selected")) {
              shoptet.phoneInput.setSelectedCountry(flag, parentGroup, true);
            }
            shoptet.phoneInput.setLastPreferredCountry(parentGroup);
          });
        })(flagsEl[key], parentGroup);
      }
    }
  }
  function interconnectFlagsWithSelect() {
    var flagsGroups = document.querySelectorAll(
      ".country-flags:not(.initialized)"
    );
    for (var key in flagsGroups) {
      if (typeof flagsGroups[key] === "object") {
        shoptet.phoneInput.handleFlags(flagsGroups[key]);
        flagsGroups[key].classList.add("initialized");
      }
    }
  }
  function hideCountriesSelect(el) {
    var inner = el.querySelector(".country-flags-inner");
    inner.scrollTop = 0;
    el.classList.remove("active");
    el.blur();
  }
  function setSelectedCountry(el, parentGroup, signal) {
    var select = parentGroup.nextElementSibling;
    var input = select.nextElementSibling;
    var originalValue = JSON.parse(select.value);
    var newValue = el.dataset.rel;
    if (originalValue.countryCode !== newValue) {
      var selectedItem = parentGroup.querySelector(".selected");
      if (selectedItem) {
        selectedItem.classList.remove("selected");
      }
      el.classList.add("selected");
      shoptet.phoneInput.selectSelectedOption(parentGroup, el, select);
      if (signal) {
        shoptet.scripts.signalCustomEvent("ShoptetPhoneCodeChange", input);
      }
    }
  }
  function setLastPreferredCountry(parentGroup) {
    var lastPreferred = parentGroup.querySelector(
      ".country-flag-preferred-last"
    );
    if (lastPreferred) {
      lastPreferred.classList.remove("country-flag-preferred-last");
    }
    var preferred = parentGroup.querySelectorAll(
      ".country-flag-preferred:not(.selected)"
    );
    if (preferred.length > 0) {
      lastPreferred = preferred[preferred.length - 1];
      lastPreferred.classList.add("country-flag-preferred-last");
    }
  }
  function selectSelectedOption(parentGroup, el, select) {
    var options = select.getElementsByTagName("option");
    var selectedIndex = false;
    for (var i = 0; i < options.length; i++) {
      options[i].removeAttribute("selected");
      var optionValue = JSON.parse(options[i].value);
      if (optionValue.countryCode === el.dataset.rel) {
        selectedIndex = i;
      }
    }
    options[selectedIndex].setAttribute("selected", "selected");
  }
  function handleKeyCodes(e, el) {
    var suggestedFlag = el.querySelector(".country-flag.suggested");
    if (suggestedFlag) {
      suggestedFlag.classList.remove("suggested");
    }
    if (e.keyCode === shoptet.common.keyCodes.escape) {
      shoptet.phoneInput.hideCountriesSelect(el);
      shoptet.phoneInput.pressedKeys = "";
      return;
    }
    if (e.keyCode === shoptet.common.keyCodes.enter) {
      if (shoptet.phoneInput.matchedElement) {
        shoptet.phoneInput.matchedElement.click();
        shoptet.phoneInput.matchedElement = false;
      }
      shoptet.phoneInput.hideCountriesSelect(el);
      shoptet.phoneInput.pressedKeys = "";
      return;
    }
    clearTimeout(shoptet.phoneInput.phoneInputKeyup);
    shoptet.phoneInput.pressedKeys += translateKeys(
      String.fromCharCode(e.keyCode)
    );
    shoptet.phoneInput.phoneInputKeyup = setTimeout(function () {
      shoptet.phoneInput.pressedKeys = "";
    }, 1e3);
    var matchedElement = el.querySelector(
      '[data-country-name^="' + shoptet.phoneInput.pressedKeys + '"]'
    );
    if (matchedElement) {
      shoptet.phoneInput.matchedElement = matchedElement;
      matchedElement.classList.add("suggested");
      var parent = matchedElement.offsetParent;
      parent.scrollTop = matchedElement.offsetTop;
    } else {
      shoptet.phoneInput.matchedElement = false;
    }
  }
  function positionCountriesSelect(el) {
    el.classList.remove("turned");
    var wrapper = el.querySelector(".country-flags-inner");
    var rect = wrapper.getBoundingClientRect();
    var documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    if (window.pageYOffset + rect.bottom > documentHeight) {
      el.classList.add("turned");
    }
  }
  function translateKeys(key) {
    switch (key) {
      case "2":
        return "Äš";
      case "3":
        return "Å ";
      case "4":
        return "ÄŒ";
      case "5":
        return "Å˜";
      case "6":
        return "Å½";
      case "7":
        return "Ã";
      case "8":
        return "Ã";
      case "9":
        return "Ã";
      case "0":
        return "Ã‰";
      default:
        return key;
    }
  }
  for (var i = 0; i < shoptet.validator.events.length; i++) {
    document.addEventListener(shoptet.validator.events[i], function () {
      shoptet.phoneInput.interconnectFlagsWithSelect();
    });
  }
  document.addEventListener("click", function () {
    var flagsGroups = document.getElementsByClassName("country-flags");
    for (var key in flagsGroups) {
      if (typeof flagsGroups[key] === "object") {
        shoptet.phoneInput.hideCountriesSelect(flagsGroups[key]);
      }
    }
  });
  shoptet.phoneInput = shoptet.phoneInput || {};
  shoptet.scripts.libs.phoneInput.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "phoneInput");
  });
  shoptet.phoneInput.phoneInputKeyup = false;
  shoptet.phoneInput.pressedKeys = "";
  shoptet.phoneInput.matchedElement = false;
})(shoptet);

(function (shoptet) {
  function getElements() {
    return document.querySelectorAll(".btn-cofidis");
  }
  function setMinPayment(el, minPayment) {
    el.querySelector("b").textContent = minPayment;
    el.classList.remove("hidden");
  }
  function calculator($newPriceHolder, $cofidis) {
    var newPrice = parseFloat($newPriceHolder.text().replace(/[^\d,.-]/g, ""));
    $cofidis.attr(
      "data-url",
      $cofidis
        .attr("data-url")
        .replace(/(cenaZbozi=)(.+)(&idObchodu)/, "$1" + newPrice + "$3")
    );
  }
  function handleClick(e) {
    e.preventDefault();
    var url = e.currentTarget.dataset.url;
    window.open(url, "iPlatba", "width=770,height=650,menubar=no,toolbar=no");
  }
  function addCalculatorListeners() {
    var cofidisCalculatorLinks = document.querySelectorAll(".js-cofidis-open");
    for (var i = 0; i < cofidisCalculatorLinks.length; i++) {
      cofidisCalculatorLinks[i].removeEventListener(
        "click",
        shoptet.cofidis.handleClick
      );
      cofidisCalculatorLinks[i].addEventListener(
        "click",
        shoptet.cofidis.handleClick
      );
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    shoptet.cofidis.addCalculatorListeners();
    var elements = shoptet.cofidis.getElements();
    var successCallback = function (response) {
      var index = response.getFromPayload("index");
      var minPayment = response.getFromPayload("minPayment");
      if (minPayment) {
        shoptet.cofidis.setMinPayment(elements[index], minPayment);
      }
    };
    for (var i = 0; i < elements.length; i++) {
      shoptet.ajax.makeAjaxRequest(
        "/action/Iplatba/GetMinPayment/",
        shoptet.ajax.requestTypes.post,
        { price: parseInt(elements[i].getAttribute("data-price")), index: i },
        { success: successCallback },
        { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
      );
    }
  });
  document.addEventListener("ShoptetDOMContentLoaded", function () {
    shoptet.cofidis.addCalculatorListeners();
  });
  shoptet.cofidis = shoptet.cofidis || {};
  shoptet.scripts.libs.cofidis.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "cofidis");
  });
})(shoptet);

(function (shoptet) {
  document.addEventListener("DOMContentLoaded", function () {
    var menus = document.querySelectorAll(".admin-bar #bar-menu > li");
    for (var i = 0; i < menus.length; i++) {
      menus[i].addEventListener("mouseenter", function (e) {
        clearTimeout(shoptet.runtime.adminBar);
        for (i = 0; i < menus.length; i++) {
          menus[i].classList.remove("hover");
        }
        e.target.classList.add("hover");
      });
      menus[i].addEventListener("mouseleave", function (e) {
        clearTimeout(shoptet.runtime.adminBar);
        var menus = $("#bar-menu > li");
        shoptet.runtime.adminBar = setTimeout(function () {
          for (i = 0; i < menus.length; i++) {
            menus[i].classList.remove("hover");
          }
        }, shoptet.config.adminBarTimeout);
      });
    }
  });
  shoptet.adminBar = shoptet.adminBar || {};
})(shoptet);

shoptet.validator.invalidEmails = [
  "centum.cz",
  "cetrum.cz",
  "emai.cz",
  "eznam.cz",
  "gamil.com",
  "gmail.co",
  "gmai.com",
  "gmail.cz",
  "gmail.sk",
  "gmail.hu",
  "gmail.pl",
  "gmail.de",
  "gmail.ro",
  "setnam.cz",
  "seunam.cz",
  "seynam.cz",
  "sezmam.cz",
  "sezn.cz",
  "sezna.cz",
  "seznam.com",
  "seznan.cz",
  "seznma.cz",
  "sznam.cz",
];
var transformers = {
  "titlecase-words": function (elementValue) {
    var words = elementValue.split(/\s+/);
    for (var i = 0; i < words.length; ++i) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    }
    var transformed = words.join(" ");
    return transformed;
  },
  "uppercase-first": function (elementValue) {
    var transformed =
      elementValue.charAt(0).toUpperCase() + elementValue.substr(1);
    return transformed;
  },
};
var transform = function () {
  var elementValue = new String($(this).val());
  var dataTransform = $(this).attr("data-transform");
  if (dataTransform in transformers) {
    var elementValue = elementValue.trim();
    if (elementValue) {
      if (!$(this).data("transformed")) {
        var transformed = transformers[dataTransform](elementValue);
        $(this).val(transformed);
        if (elementValue !== transformed) {
          $(this).data("transformed", elementValue !== transformed);
          if (!$(this).is(".warning-field, .error-field")) {
            shoptet.validator.showValidatorMessage(
              $(this),
              shoptet.messages["validatorTextWasTransformed"],
              "msg-info"
            );
          }
          shoptet.scripts.signalCustomEvent("ShoptetValidationTransform", this);
        }
      }
    } else {
      $(this).data("transformed", false);
    }
  } else {
    throw new Error("Unknown transformation.");
  }
};
var softWarning = false;
var validators = {
  required: function (elementValue) {
    var isValid = true;
    if ($(this).attr("required") || $(this).hasClass("required")) {
      if ($(this).attr("type") == "checkbox") {
        if (!$(this).is(":checked")) {
          isValid = false;
          var specialMessage = $(this).attr("data-special-message");
          if (specialMessage) {
            shoptet.validator.message = shoptet.messages[specialMessage];
          } else {
            shoptet.validator.message = shoptet.messages["validatorCheckbox"];
          }
        }
      } else if (!elementValue.trim()) {
        isValid = false;
        shoptet.validator.message = shoptet.messages["validatorRequired"];
      }
    }
    return isValid;
  },
  password: function (elementValue) {
    var isValid = true;
    if (
      $(this).attr("type") == "password" &&
      $(this).attr("id") == "passwordAgain"
    ) {
      var $password = $(this)
        .closest("form")
        .find("input#password[type=password]");
      if ($password && $(this).val() != $password.val()) {
        isValid = false;
        shoptet.validator.message = shoptet.messages["validatorPassword"];
      }
    }
    return isValid;
  },
  email: function (elementValue) {
    var isValid = true;
    if ($(this).attr("type") == "email") {
      isValid = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(
        elementValue.trim()
      );
      shoptet.validator.message = shoptet.messages["validatorEmail"];
      if (isValid) {
        var domain = elementValue.trim().split("@")[1];
        var tld = domain.split(".");
        tld = tld[tld.length - 1];
        if (tld.length < 2) {
          isValid = false;
        }
        if ($.inArray(domain, shoptet.validator.invalidEmails) !== -1) {
          isValid = false;
        }
      }
    }
    return isValid;
  },
  fullname: function (elementValue) {
    var isValid = true;
    if (
      $(this).attr("id") == "billFullName" ||
      $(this).attr("id") == "deliveryFullName"
    ) {
      isValid = / /i.test(elementValue.trim());
      shoptet.validator.message = shoptet.messages["validatorFullName"];
    }
    return isValid;
  },
  billStreet: function (elementValue) {
    var isValid = true;
    if ($(this).attr("id") == "billStreet" && $(this).attr("data-warning")) {
      isValid = !/\s(\d+)(\/\d+)?[a-z]?$/i.test(elementValue.trim());
      shoptet.validator.message = shoptet.messages["validatorStreet"];
    }
    return isValid;
  },
  billHouseNumber: function (elementValue) {
    var isValid = true;
    if ($(this).attr("id") == "billHouseNumber") {
      isValid = /^(\d+)(\/\d+)?(\s)?(\/)?[a-z]?$/i.test(elementValue.trim());
      shoptet.validator.message = shoptet.messages["validatorHouseNumber"];
    }
    return isValid;
  },
};
var validate = function (isSubmit) {
  var isValid = true;
  if (!$(this).hasClass("no-js-validation")) {
    var elementValue = new String($(this).val());
    if (isSubmit || elementValue.length) {
      for (var validator in validators) {
        isValid = validators[validator].call(this, elementValue);
        if (!isValid) {
          if (!$(this).attr("data-warning")) {
            var softWarning = false;
            break;
          } else {
            var softWarning = true;
            isValid = true;
          }
        }
      }
    }
  }
  if (isValid) {
    $(this).removeClass("error-field");
    $(this).removeClass("warning-field");
    shoptet.validator.removeValidatorMessage($(this));
    if (softWarning) {
      $(this).addClass("warning-field");
      if (typeof shoptet.validator.message !== "undefined") {
        shoptet.validator.showValidatorMessage(
          $(this),
          shoptet.validator.message,
          "msg-warning"
        );
      }
      shoptet.scripts.signalCustomEvent("ShoptetValidationWarning", $(this)[0]);
      softWarning = false;
    }
  } else {
    $(this).addClass("error-field");
    if (typeof shoptet.validator.message !== "undefined") {
      shoptet.validator.showValidatorMessage(
        $(this),
        shoptet.validator.message,
        "msg-error"
      );
    }
    shoptet.scripts.signalCustomEvent("ShoptetValidationError", $(this)[0]);
  }
  return isValid;
};
shoptet.validator.initValidator = function ($el, settings) {
  return $el.each(function () {
    shoptet.validator.shoptetFormValidator.init(this, settings);
  });
};
shoptet.validator.shoptetFormValidator = {
  messages: {},
  init: function (currentForm, settings) {
    if (currentForm.tagName != "FORM") {
      return;
    }
    var $currentForm = $(currentForm);
    var $elements = $currentForm.find(
      "input[required], input.required, textarea[required], input#companyId, input#passwordAgain, .js-validate"
    );
    if (!$elements.length) {
      return;
    } else {
      $elements.change(function () {
        var isSubmit = false;
        return validate.call($(this), isSubmit);
      });
      $currentForm.find("[data-transform]").blur(transform);
    }
    settings = settings || {};
    $currentForm.data("validatorSettings", settings);
    $currentForm.submit(function (event) {
      var invalidElementsCounter = 0;
      $elements.each(function () {
        var isSubmit = true;
        if ($(this).hasClass("js-validation-suspended")) {
          return;
        }
        var isElementValid = validate.call($(this), isSubmit);
        if (
          !isElementValid &&
          invalidElementsCounter++ == 0 &&
          shoptet.validatorPhone.ajaxPending === 0
        ) {
          $(this).focus();
        }
      });
      if (shoptet.validatorPhone.ajaxPending !== 0) {
        event.preventDefault();
        new Promise(function (resolve) {
          document.addEventListener(
            shoptet.validatorPhone.ajaxDoneEvent,
            resolve
          );
        }).then(function () {
          $currentForm.submit();
        });
      }
      if (invalidElementsCounter) {
        $currentForm.addClass("validation-failed");
        if ($.isFunction($currentForm.data("validatorSettings").onFailed)) {
          $currentForm.data("validatorSettings").onFailed();
        }
        event.stopImmediatePropagation();
        setTimeout(function () {
          $("body").css("cursor", "inherit");
        }, 100);
        shoptet.scripts.signalCustomEvent(
          "ShoptetFailedValidation",
          $currentForm[0]
        );
        shoptet.custom.postFailedValidation($currentForm[0]);
        return false;
      } else {
        $currentForm.removeClass("validation-failed");
        var $unveiledElements = $currentForm.find("[data-unveil]");
        $unveiledElements.each(function () {
          var isChecked = $(this).is(":checked");
          if (!isChecked) {
            var clearBlockId = $(this).data("unveil");
            $("#" + clearBlockId)
              .find("input, textarea")
              .each(function () {
                $(this).val("");
              });
          }
        });
        var requiredFields = document.getElementsByClassName(
          "js-validate-required"
        );
        for (var key in requiredFields) {
          if (typeof requiredFields[key] === "object") {
            shoptet.scripts.signalCustomEvent(
              "validatedFormSubmit",
              requiredFields[key]
            );
          }
        }
        var invalid = shoptet.validator.formContainsInvalidFields(
          $currentForm[0]
        );
        if (invalid) {
          var $firstInvalidEl = $currentForm
            .find(shoptet.validator.invalidFieldClasses)
            .first()
            .parents(".form-group");
          scrollToEl($firstInvalidEl);
          shoptet.scripts.signalCustomEvent(
            "ShoptetFailedValidation",
            $currentForm[0]
          );
          shoptet.custom.postFailedValidation($currentForm[0]);
          return false;
        }
        shoptet.scripts.signalCustomEvent(
          "ShoptetSuccessfulValidation",
          $currentForm[0]
        );
        return shoptet.custom.postSuccessfulValidation($currentForm[0]);
      }
    });
    return this;
  },
};
shoptet.validator.showValidatorMessage = function ($el, message, cssClass) {
  $el.data("validatorMessageMessage", message);
  return $el.each(function () {
    shoptet.validator.validatorMessage.show($el, cssClass);
  });
};
shoptet.validator.removeValidatorMessage = function ($el) {
  return $el.each(function () {
    shoptet.validator.validatorMessage.hide($el);
  });
};
shoptet.validator.validatorMessage = {
  init: function ($el) {
    var id = "id-" + Math.floor(Math.random() * 1024 + Math.random() * 2048);
    $('<div class="validator-msg" id="' + id + '"></div>').appendTo($("body"));
    var $container = $("#" + id);
    $("html").on("click", "#" + id, function () {
      $container.prev("input").removeClass("error-field");
      $container.remove();
      $el.data("validatorMessage", false);
    });
    $el.data("validatorMessage", $container);
    $container.data("parent", $el);
  },
  show: function ($el, cssClass) {
    if (!$el.data("validatorMessage")) {
      this.init($el);
    }
    var $container = $el.data("validatorMessage");
    $container.addClass(cssClass).html($el.data("validatorMessageMessage"));
    $container.insertBefore($el);
    $container.fadeIn(150);
  },
  hide: function ($el) {
    if ($el.data("validatorMessage")) {
      var validatorMessage = $el.data("validatorMessage");
      validatorMessage.remove();
      $el.data("validatorMessage", false);
    }
  },
};

(function ($) {
  function format(str) {
    for (var i = 1; i < arguments.length; i++) {
      str = str.replace("%" + (i - 1), arguments[i]);
    }
    return str;
  }
  function CloudZoom(jWin, opts) {
    var sImg = $("img", jWin);
    var img1;
    var img2;
    var zoomDiv = null;
    var $mouseTrap = null;
    var lens = null;
    var $tint = null;
    var softFocus = null;
    var zoomImage;
    var controlTimer = 0;
    var cw, ch;
    var destU = 0;
    var destV = 0;
    var currV = 0;
    var currU = 0;
    var filesLoaded = 0;
    var mx,
      my,
      touchTimer = 0,
      zoomActive = false,
      zoomActiveShow = true;
    var ctx = this,
      zw;
    setTimeout(function () {
      if ($mouseTrap === null) {
        var w = jWin.width();
        jWin
          .parent()
          .append(
            format(
              '<div style="width:%0px;position:absolute;top:75%;left:%1px;text-align:center" class="cloud-zoom-loading" >Loading...</div>',
              w / 3,
              w / 2 - w / 6
            )
          )
          .find(":last")
          .css("opacity", 0.5);
      }
    }, 200);
    this.removeBits = function () {
      if (lens) {
        lens.remove();
        lens = null;
      }
      if ($tint) {
        $tint.remove();
        $tint = null;
      }
      if (softFocus) {
        softFocus.remove();
        softFocus = null;
      }
      if (filesLoaded) {
        filesLoaded = 0;
      }
      $(".cloud-zoom-loading", jWin.parent()).remove();
    };
    this.destroy = function () {
      jWin.data("zoom", null);
      if ($mouseTrap) {
        $mouseTrap.unbind();
        $mouseTrap.remove();
        $mouseTrap = null;
      }
      if (zoomDiv) {
        zoomDiv.remove();
        zoomDiv = null;
      }
      this.removeBits();
    };
    this.fadedOut = function () {
      if (zoomDiv) {
        zoomDiv.remove();
        zoomDiv = null;
      }
      this.removeBits();
    };
    this.controlLoop = function () {
      if (lens) {
        var x = (mx - sImg.offset().left - cw * 0.5) >> 0;
        var y = (my - sImg.offset().top - ch * 0.5) >> 0;
        if (x < 0) {
          x = 0;
        } else if (x > sImg.outerWidth() - cw) {
          x = sImg.outerWidth() - cw;
        }
        if (y < 0) {
          y = 0;
        } else if (y > sImg.outerHeight() - ch) {
          y = sImg.outerHeight() - ch;
        }
        lens.css({ left: x, top: y });
        lens.css("background-position", -x + "px " + -y + "px");
        destU = ((x / sImg.outerWidth()) * zoomImage.width) >> 0;
        destV = ((y / sImg.outerHeight()) * zoomImage.height) >> 0;
        currU += (destU - currU) / opts.smoothMove;
        currV += (destV - currV) / opts.smoothMove;
        zoomDiv.css(
          "background-position",
          -(currU >> 0) + "px " + (-(currV >> 0) + "px")
        );
        if (zoomActive) {
          zoomDiv.css("display", "block");
        } else {
          zoomDiv.css("display", "none");
        }
      }
      controlTimer = setTimeout(function () {
        ctx.controlLoop();
      }, 30);
    };
    this.init2 = function (img, id) {
      filesLoaded++;
      if (id === 1) {
        zoomImage = img;
      }
      if (filesLoaded === 2) {
        this.init();
      }
    };
    this.setPositionZoom = function (event) {
      mx = event.originalEvent.touches[0].pageX;
      my = event.originalEvent.touches[0].pageY;
    };
    this.startZoom = function (event) {
      if (zoomActiveShow) {
        zoomActiveShow = false;
        mx = event.pageX;
        my = event.pageY;
        zw = event.data;
        if (zoomDiv) {
          zoomDiv.stop(true, false);
          zoomDiv.remove();
        }
        var xPos = opts.adjustX,
          yPos = opts.adjustY;
        var siw = sImg.outerWidth();
        var sih = sImg.outerHeight();
        var w = opts.zoomWidth;
        var h = opts.zoomHeight;
        if (opts.zoomWidth == "auto") {
          w = siw;
        }
        if (opts.zoomHeight == "auto") {
          h = sih;
        }
        var appendTo = jWin.parent();
        switch (opts.position) {
          case "top":
            yPos -= h;
            break;
          case "right":
            xPos += siw;
            break;
          case "bottom":
            yPos += sih;
            break;
          case "left":
            xPos -= w;
            break;
          case "inside":
            w = siw;
            h = sih;
            break;
          default:
            appendTo = $("#" + opts.position);
            if (!appendTo.length) {
              appendTo = jWin;
              xPos += siw;
              yPos += sih;
            } else {
              w = appendTo.innerWidth();
              h = appendTo.innerHeight();
            }
        }
        zoomDiv = appendTo
          .append(
            format(
              '<div id="cloud-zoom-big" class="cloud-zoom-big" style="display:none;position:absolute;left:%0px;top:%1px;width:100%;height:%3px;background-image:url(\'%4\');background-repeat:no-repeat;background-color:#fff;z-index:40;"></div>',
              xPos,
              yPos,
              w,
              h,
              zoomImage.src
            )
          )
          .find(":last");
        if (sImg.attr("title") && opts.showTitle) {
          zoomDiv
            .append(
              format(
                '<div class="cloud-zoom-title">%0</div>',
                sImg.attr("title")
              )
            )
            .find(":last")
            .css("opacity", opts.titleOpacity);
        }
        zoomDiv.fadeIn(500);
        if (lens) {
          lens.remove();
          lens = null;
        }
        cw = (sImg.outerWidth() / zoomImage.width) * zoomDiv.width();
        ch = (sImg.outerHeight() / zoomImage.height) * zoomDiv.height();
        lens = jWin
          .append(
            format(
              "<div class='cloud-zoom-lens' style='display:none;z-index:1;position:absolute;width:%0px;height:%1px;'></div>",
              cw,
              ch
            )
          )
          .find(":last");
        $mouseTrap.css("cursor", lens.css("cursor"));
        var noTrans = false;
        if (opts.tint) {
          lens.css("background", 'url("' + sImg.attr("src") + '")');
          $tint = jWin
            .append(
              format(
                '<div style="display:none;position:absolute; left:0px; top:0px; width:%0px; height:%1px; background-color:%2;" />',
                sImg.outerWidth(),
                sImg.outerHeight(),
                opts.tint
              )
            )
            .find(":last");
          $tint.css("opacity", opts.tintOpacity);
          noTrans = true;
          $tint.fadeIn(500);
        }
        if (opts.softFocus) {
          lens.css("background", 'url("' + sImg.attr("src") + '")');
          softFocus = jWin
            .append(
              format(
                '<div style="position:absolute;display:none;top:2px; left:2px; width:%0px; height:%1px;" />',
                sImg.outerWidth() - 2,
                sImg.outerHeight() - 2,
                opts.tint
              )
            )
            .find(":last");
          softFocus.css("background", 'url("' + sImg.attr("src") + '")');
          softFocus.css("opacity", 0.5);
          noTrans = true;
          softFocus.fadeIn(500);
        }
        if (!noTrans) {
          lens.css("opacity", opts.lensOpacity);
        }
        if (opts.position !== "inside") {
          lens.fadeIn(500);
        }
        zw.controlLoop();
      }
      return;
    };
    this.closeZoom = function () {
      zoomActiveShow = true;
      clearTimeout(controlTimer);
      if (lens) {
        lens.fadeOut(299);
      }
      if ($tint) {
        $tint.fadeOut(299);
      }
      if (softFocus) {
        softFocus.fadeOut(299);
      }
      zoomDiv.fadeOut(300, function () {
        ctx.fadedOut();
      });
      return false;
    };
    this.init = function () {
      $(".cloud-zoom-loading", jWin.parent()).remove();
      $mouseTrap = jWin
        .parent()
        .append(
          format(
            "<div class='mousetrap' style='background-image:url(\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\");z-index:50;position:absolute;width:100%;height:%1px;left:%2px;top:%3px;'></div>",
            sImg.outerWidth(),
            sImg.outerHeight(),
            0,
            0
          )
        )
        .find(":last");
      $mouseTrap.bind("touchstart", this, function (event) {
        touchTimer = setTimeout(function () {
          ctx.startZoom(event);
          ctx.setPositionZoom(event);
          zoomActive = true;
        }, 150);
      });
      $mouseTrap.bind("touchmove", this, function (event) {
        if (zoomActive) {
          ctx.setPositionZoom(event);
          event.preventDefault();
        } else {
          clearTimeout(touchTimer);
        }
      });
      $mouseTrap.bind("touchend", this, function (event) {
        if (zoomActive) {
          ctx.closeZoom(event);
        } else {
          clearTimeout(touchTimer);
        }
        zoomActive = false;
      });
      $mouseTrap.bind("mousemove", this, function (event) {
        mx = event.pageX;
        my = event.pageY;
      });
      $mouseTrap.bind("mouseenter", this, function (event) {
        zoomActive = true;
        ctx.startZoom(event);
      });
      $mouseTrap.bind("mouseleave", this, function (event) {
        ctx.closeZoom(event);
      });
    };
    img1 = new Image();
    $(img1).load(function () {
      ctx.init2(this, 0);
    });
    img1.src = sImg.attr("src");
    img2 = new Image();
    $(img2).load(function () {
      ctx.init2(this, 1);
    });
    img2.src = jWin.attr("data-href");
  }
  $.fn.CloudZoom = function (options) {
    this.each(function () {
      var relOpts, opts;
      relOpts = $(this).attr("rel");
      if ($(this).is(".cloud-zoom")) {
        $(this).css({ position: "relative", display: "block" });
        $("img", $(this)).css({ display: "block" });
        if ($(this).parent().attr("id") != "wrap") {
          $(this).wrap(
            '<div id="wrap" style="top:0px;z-index:0;position:relative;"></div>'
          );
        }
        opts = $.extend({}, $.fn.CloudZoom.defaults, options);
        opts = $.extend({}, opts, relOpts);
        $(this).data("zoom", new CloudZoom($(this), opts));
      } else if ($(this).is(".cloud-zoom-gallery")) {
        opts = $.extend({}, relOpts, options);
        $(this).data("relOpts", opts);
        $(this).bind("click", $(this), function (event) {
          var data = event.data.data("relOpts");
          var $useZoom = $("#" + data.useZoom);
          $useZoom.data("zoom").destroy();
          $useZoom.attr("data-href", event.data.attr("data-href"));
          $("#" + data.useZoom + " img").attr(
            "src",
            event.data.data("relOpts").smallImage
          );
          $("#" + event.data.data("relOpts").useZoom).CloudZoom();
          return false;
        });
      }
    });
    return this;
  };
  $.fn.CloudZoom.defaults = {
    zoomWidth: "auto",
    zoomHeight: "auto",
    position: "right",
    tint: false,
    tintOpacity: 0.5,
    lensOpacity: 0.5,
    softFocus: false,
    smoothMove: 3,
    showTitle: true,
    titleOpacity: 0.5,
    adjustX: 0,
    adjustY: 0,
  };
})(jQuery);

$(document).ready(function () {
  shoptet.config.cloudZoomOptions = {
    position: "inside",
    showTitle: false,
    adjustX: 0,
    adjustY: 0,
  };
  $(".cloud-zoom").CloudZoom(shoptet.config.cloudZoomOptions);
  $("html").on("click", ".mousetrap", function () {
    $(this).prev("a.p-main-image").trigger("click");
  });
});

if (shoptet.abilities.feature.tabs_accordion) {
  $(document).ready(function () {
    $(".shp-accordion.active .shp-accordion-content").show();
    $(".shp-accordion-link").click(function () {
      $(this).parent().toggleClass("active");
      $(this).next(".shp-accordion-content").slideToggle();
      return false;
    });
  });
}

if (shoptet.abilities.feature.tabs_responsive) {
  (function ($) {
    $.fn.shpResponsiveNavigation = function () {
      return this.each(function () {
        var $this = $(this),
          maxWidth,
          visibleLinks,
          hiddenLinks,
          button;
        maxWidth = $(this).width();
        if (maxWidth > 0) {
          setup($this);
          function setup(resNavDiv) {
            visibleLinks = resNavDiv.find(".visible-links");
            visibleLinks.children("li").each(function () {
              $(this).attr("data-width", $(this).outerWidth());
            });
            if (!resNavDiv.find(".hidden-links").length) {
              resNavDiv.append(
                '<button class="navigation-btn" style="display: none;">' +
                  '&#9776;</button><ul class="hidden-links hidden"></ul>'
              );
            }
            hiddenLinks = resNavDiv.find(".hidden-links");
            button = resNavDiv.find("button");
            update($this);
          }
          function update(resNavDiv) {
            maxWidth = resNavDiv.width();
            var filledSpace = button.outerWidth();
            if (visibleLinks.outerWidth() + filledSpace > maxWidth) {
              visibleLinks.children("li").each(function (index) {
                filledSpace += $(this).data("width");
                if (filledSpace >= maxWidth) {
                  $(this).appendTo(hiddenLinks);
                }
              });
            } else {
              filledSpace += visibleLinks.width();
              hiddenLinks.children("li").each(function (index) {
                filledSpace += $(this).data("width");
                if (filledSpace < maxWidth) {
                  $(this).appendTo(visibleLinks);
                }
              });
            }
            if (hiddenLinks.children("li").length == 0) {
              button.hide();
            } else {
              button.show();
            }
            $(".responsive-nav li a").on("click", function () {
              hiddenLinks.addClass("hidden");
            });
          }
          $(window).resize(function () {
            update($this);
          });
          $(button).click(function () {
            hiddenLinks.toggleClass("hidden");
          });
        }
      });
    };
  })(jQuery);
  $(document).ready(function () {
    $(".responsive-nav").shpResponsiveNavigation();
  });
}

if (shoptet.abilities.feature.top_navigation_menu) {
  function topMenuFits() {
    var $topMenuWrapper = $(".top-navigation-menu");
    if (
      !detectResolution(shoptet.config.breakpoints.sm) &&
      !$topMenuWrapper.is(":visible")
    ) {
      return false;
    }
    var fits = true;
    $(".top-navigation-bar-menu li").removeClass("cropped");
    $(".top-navigation-bar-menu-helper").empty();
    var menuPadding = parseInt($topMenuWrapper.css("padding-right"));
    $(".top-navigation-bar-menu li").each(function () {
      if (!shoptet.common.fitsToParentWidth($(this)[0], menuPadding)) {
        $(this).addClass("cropped");
        $(this).nextAll().addClass("cropped");
        $(this)
          .parents("ul")
          .find(".cropped")
          .clone()
          .appendTo(".top-navigation-bar-menu-helper");
        fits = false;
        return false;
      }
    });
    return fits;
  }
  function showTopMenuTrigger() {
    $("body").addClass("top-menu-trigger-visible");
  }
  function hideTopMenuTrigger() {
    $("body").removeClass("top-menu-trigger-visible");
  }
  $(document).on("menuUnveiled resizeEnd", function () {
    if (topMenuFits()) {
      hideTopMenuTrigger();
    } else {
      showTopMenuTrigger();
    }
  });
  $(document).on("click", function () {
    $("body").removeClass("top-navigation-menu-visible");
  });
  $(document).ready(function () {
    $("html").on("click", ".top-navigation-menu-trigger", function (e) {
      e.stopPropagation();
      $("body").toggleClass("top-navigation-menu-visible");
    });
    if (topMenuFits()) {
      hideTopMenuTrigger();
    } else {
      showTopMenuTrigger();
    }
  });
}

var categoryMinValue = parseInt($("#categoryMinValue").text());
var categoryMaxValue = parseInt($("#categoryMaxValue").text());
var currencyExchangeRate = shoptet.helpers.toFloat(
  $("#currencyExchangeRate").text()
);
$.colorbox.settings.opacity = shoptet.config.colorbox.opacity;
$.colorbox.settings.maxWidth = shoptet.config.colorbox.maxWidth;
$.colorbox.settings.initialWidth = shoptet.config.colorbox.widthMd;
$.colorbox.settings.initialHeight = shoptet.config.colorbox.initialHeight;
shoptet.config.bodyClasses =
  "user-action-visible" +
  " navigation-window-visible" +
  " cart-window-visible" +
  " search-window-visible" +
  " login-window-visible" +
  " register-window-visible" +
  " menu-helper-visible" +
  " submenu-visible" +
  " top-navigation-menu-visible" +
  " categories-window-visible";
function showMessage(content, type, id, cancel, overlay, parent) {
  parent = parent || ".messages";
  if (typeof id === "undefined") {
    id = "";
  }
  if (typeof cancel === "undefined") {
    cancel = false;
  }
  if (typeof overlay === "undefined") {
    overlay = false;
  }
  hideMsg(true);
  clearTimeout(shoptet.config.dismiss);
  if ($(".msg").length) {
    hideMsg(true);
  }
  if (cancel !== false) {
    cancel =
      ' <a href="#" class="cancel-action" data-id="' +
      id +
      '">' +
      shoptet.messages["cancel"] +
      "</a>";
  } else {
    cancel = "";
  }
  $(
    '<div class="msg msg-' +
      type +
      '"><div class="container">' +
      content +
      cancel +
      "</div></div>"
  ).prependTo(parent);
  if (overlay === true) {
    $('<div class="overlay visible" />').appendTo("body");
    $("body").addClass("msg-visible");
  }
  dismissMessages();
}
function hideMsg(action) {
  $("body").removeClass("msg-visible");
  if (typeof action != "undefined") {
    $(".msg, .overlay.visible").remove();
  } else {
    $(".msg, .overlay.visible").addClass("hidden");
    setTimeout(function () {
      $(".msg, .overlay.visible").remove();
    }, shoptet.config.animationDuration);
  }
}
function dismissMessages() {
  shoptet.runtime.dismiss = setTimeout(function () {
    hideMsg();
  }, shoptet.config.dismissTimeout);
}
function cancelAction(id) {
  if (typeof id == "undefined") {
    hideMsg();
  } else {
    $("#" + id)
      .removeClass("hidden")
      .removeAttr("id");
    clearTimeout(removeItem);
    hideMsg();
  }
}
function showSpinner() {
  $("body")
    .addClass("spinner-visible")
    .append('<div class="overlay spinner"><div class="loader" /></div>');
}
function hideSpinner() {
  $(".overlay.spinner").addClass("invisible");
  setTimeout(function () {
    $("body").removeClass("spinner-visible");
    $(".overlay.spinner").detach();
  }, shoptet.config.animationDuration);
}
function initTooltips() {
  $(".tooltip").hide();
  $(".show-tooltip").tooltip({
    html: true,
    placement: "auto",
    container: "body",
  });
}
function getScrollBarWidth() {
  var inner = document.createElement("p");
  inner.style.width = "100%";
  inner.style.height = "200px";
  var outer = document.createElement("div");
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return w1 - w2;
}
function detectResolution(resolution) {
  return parseInt($(window).width()) + getScrollBarWidth() > resolution;
}
function detectScrolled(direction) {
  if (!shoptet.abilities.feature.fixed_header) {
    return;
  }
  var classToRemove;
  var top = 0;
  var adminBarHeight = $(".admin-bar").length ? $(".admin-bar").height() : 0;
  var topNavigationBarHeight = $(".top-navigation-bar").length
    ? $(".top-navigation-bar").height()
    : 0;
  detectResolution(shoptet.config.breakpoints.sm)
    ? (top = topNavigationBarHeight + adminBarHeight)
    : (top = 0);
  if (direction === "up") {
    classToRemove = "scrolled-down";
  } else {
    classToRemove = "scrolled-up";
  }
  if ($(window).scrollTop() > top) {
    $("html").addClass("scrolled scrolled-" + direction);
    $("html").removeClass(classToRemove);
    if (
      !$("body").hasClass("submenu-visible") &&
      !$("body").hasClass("menu-helper-visible")
    ) {
      shoptet.menu.hideNavigation();
    }
  } else {
    $("html").removeClass("scrolled scrolled-up scrolled-down");
    shoptet.menu.hideSubmenu();
  }
}
function toggleText($el, text, showText, hideText) {
  if (text == hideText) {
    $el.attr("data-text", hideText);
    $el.html(showText);
  } else {
    $el.attr("data-text", showText);
    $el.html(hideText);
  }
}
function toggleContacts($el) {
  var text = $el.html();
  var hideText = shoptet.messages["hideContacts"];
  var showText = $el.attr("data-original-text");
  $el.siblings(".box").toggleClass("visible");
  $el.toggleClass("expanded");
  toggleText($el, text, showText, hideText);
}
var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
function scrollToEl($el) {
  var $message = $(".messages .msg");
  var messageHeight = $message.length ? $message.outerHeight() : 0;
  var offset = $el.offset();
  var margin =
    $("#header").css("position") === "fixed" ||
    shoptet.abilities.feature.fixed_header
      ? $("#header").outerHeight()
      : 0;
  if (
    $(".admin-bar").length &&
    detectResolution(shoptet.config.breakpoints.sm)
  ) {
    var adminBarHeight = $(".admin-bar").height();
  } else {
    var adminBarHeight = 0;
  }
  $("html, body")
    .stop(true, true)
    .animate(
      { scrollTop: offset.top - messageHeight - margin - adminBarHeight - 10 },
      shoptet.config.animationDuration
    );
}
function unveilImages() {
  $("img").unveil(100, function () {
    if (!$("body").hasClass("unveiled")) {
      setTimeout(function () {
        shoptet.products.sameHeightOfProducts();
        if (detectResolution(shoptet.config.breakpoints.sm)) {
          if ($(".carousel").length) {
            setCarouselHeight($(".carousel-inner"));
            $("body").addClass("carousel-set");
          }
        }
      }, 1e3);
    }
    $("body").addClass("unveiled");
  });
  if ($(".carousel").length && !$("body").hasClass("carousel-set")) {
    setCarouselHeight($(".carousel-inner"));
  }
}
function setCarouselHeight($carousel) {
  $carousel.removeAttr("style");
  var maxHeight = 0;
  $(".carousel .item").addClass("active");
  $carousel.find("img").each(function () {
    var h = $(this).height();
    if (h > maxHeight) {
      maxHeight = h;
    }
  });
  $(".carousel .item").removeClass("active");
  $(".carousel .item:first-child").addClass("active");
  $carousel.css("min-height", maxHeight);
}
function initColorbox() {
  $(".variant-image a").colorbox();
  var $lightboxes = {};
  $("a[data-gallery]").each(function () {
    $lightboxes[$(this).data("gallery")] = 1;
  });
  if (!$.isEmptyObject($lightboxes)) {
    for (var key in $lightboxes) {
      $('*[data-gallery="' + key + '"]').colorbox({
        rel: key,
        maxWidth: shoptet.config.colorbox.maxWidth,
        width: shoptet.config.colorbox.widthLg,
        className: shoptet.config.colorbox.classLg,
      });
    }
  }
}
function addPaddingToOverallWrapper() {
  if (!shoptet.abilities.feature.positioned_footer) {
    return;
  }
  if (!detectResolution(shoptet.config.breakpoints.sm)) {
    var topNavigationBarHeight = $(".top-navigation-bar").outerHeight();
    $(".overall-wrapper").css("padding-bottom", topNavigationBarHeight);
  } else {
    $(".overall-wrapper").css("padding-bottom", 0);
  }
}
function detectVideoBackground($video) {
  return $video.length > 0;
}
function detectVideoBackgroundHeight($videoWrapper) {
  return $videoWrapper.height();
}
function pauseVideo($video) {
  if (!$video[0].paused) {
    $video[0].pause();
  }
}
function resumeVideo($video) {
  if ($video[0].paused) {
    $video[0].play();
  }
}
function handleWithVideo($video, $videoWrapper) {
  var offset = $videoWrapper.offset();
  var scrollTop = $("body").scrollTop();
  if (offset.top + detectVideoBackgroundHeight($videoWrapper) > scrollTop) {
    resumeVideo($video);
  } else {
    pauseVideo($video);
  }
}
function moveElementAfterSelector($whatSelector, $whereSelector) {
  $whatSelector.insertAfter($whereSelector);
}
function updateQueryStringParameter(key, value) {
  var url = window.location.href;
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = url.indexOf("?") !== -1 ? "&" : "?";
  if (url.match(re)) {
    window.location.href = url.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    window.location.href = url + separator + key + "=" + value;
  }
}
var availableElementsIds = ["#ratingWrapper"];
var hashUnveiledElements = [];
var hashHiddenElements = [];
hashUnveiledElements["#ratingWrapper"] = ["#rate-form"];
hashHiddenElements["#ratingWrapper"] = [".rate-form-trigger"];
function unveilElementByHash(elementId) {
  if ($(elementId).parents(".tab-pane").length) {
    var $el = $(
      '[data-toggle="tab"][href="#' +
        $(elementId).attr("data-parent-tab") +
        '"]'
    );
    $el.tab("show");
  }
  if ($(hashUnveiledElements[elementId]).length) {
    for (i = 0; i < $(hashUnveiledElements[elementId]).length; i++) {
      $(hashUnveiledElements[elementId][i]).removeClass("js-hidden");
    }
    for (i = 0; i < $(hashHiddenElements[elementId]).length; i++) {
      $(hashHiddenElements[elementId][i]).addClass("js-hidden");
    }
  }
  $(window).load(function () {
    setTimeout(function () {
      scrollToEl($(elementId));
    }, shoptet.config.animationDuration + 1);
  });
}
function locationSearchToObject() {
  var locationSearch = window.location.search.substring(1).split("&");
  var object = {};
  locationSearch.forEach(function (pair) {
    if (pair !== "") {
      var splittedPair = pair.split("=");
      object[decodeURIComponent(splittedPair[0])] = decodeURIComponent(
        splittedPair[1]
      );
    }
  });
  return object;
}
function getRelativeOffset($el, $parent) {
  if (typeof $parent === "undefined") {
    $parent = $el.parent();
  }
  var elOffset = $el.offset();
  var parentOffset = $parent.offset();
  var relativeOffset = {};
  relativeOffset.top = elOffset.top - parentOffset.top;
  relativeOffset.left = elOffset.left - parentOffset.left;
  return relativeOffset;
}
function fixTooltipAfterChange(element) {
  $(element).tooltip("fixTitle").tooltip("setContent");
  if ($(element).hasClass("hovered")) {
    $(element).tooltip("show");
  }
}
function initDatepickers() {
  $(".datepicker.birthdate").each(function () {
    var $elem = $(this);
    $elem.datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: "c-110;c:+0",
    });
    if ($elem.data("value")) {
      $elem.datepicker("setDate", new Date($elem.data("value")));
    }
    if ($elem.data("format")) {
      $elem.datepicker("option", "dateFormat", $elem.data("format"));
    }
  });
}
function resizeEndCallback() {
  shoptet.products.sameHeightOfProducts();
  setTimeout(function () {
    detectFilters();
  }, 1e3);
  shoptet.products.setThumbnailsDirection();
  shoptet.products.checkThumbnails(
    shoptet.config.thumbnailsDirection,
    "set",
    true
  );
  if (detectResolution(shoptet.abilities.config.navigation_breakpoint)) {
    shoptet.menu.splitMenu();
    if ($(".overlay").length > 0) {
      shoptet.menu.toggleMenu();
    }
  }
  shoptet.products.sameHeightOfProducts();
  shoptet.products.splitWidgetParameters();
  if ($(".carousel").length) {
    setCarouselHeight($(".carousel-inner"));
  }
  shoptet.modal.shoptetResize();
  addPaddingToOverallWrapper();
  if (
    typeof shoptet.checkout !== "undefined" &&
    shoptet.checkout.$checkoutSidebar.length
  ) {
    if (!detectResolution(shoptet.config.breakpoints.sm)) {
      shoptet.checkout.$checkoutSidebar.removeAttr("style");
    } else {
      shoptet.checkout.handleWithSidebar();
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  if ($(".regions-wrapper").length) {
    shoptet.global.toggleRegionsWrapper();
  }
  $("html").on("change", "#billCountryId, #deliveryCountryId", function () {
    shoptet.global.updateSelectedRegions($(this));
    shoptet.global.toggleRegionsWrapper();
    shoptet.validatorZipCode.updateZipValidPattern($(this));
  });
  var hash = window.location.hash;
  if (hash.length) {
    for (i = 0; i < availableElementsIds.length; i++) {
      availableElementsIds[i];
      if (availableElementsIds[i] === hash) {
        if ($(hash).length) {
          unveilElementByHash(hash);
        }
        break;
      }
    }
  }
  window.onbeforeprint = unveilImages();
  if (!detectResolution(shoptet.config.breakpoints.sm)) {
    addPaddingToOverallWrapper();
  }
  detectScrolled("up");
  var lastScrollTop = 0;
  var $headerVideoWrapper = $("#videoWrapper");
  var headerVideoBackgroundExists = detectVideoBackground($headerVideoWrapper);
  if (headerVideoBackgroundExists) {
    var $headerVideo = $("#videoWrapper video");
    setTimeout(function () {
      handleWithVideo($headerVideo, $headerVideoWrapper);
    }, 1e3);
  }
  $(window).scroll(function () {
    if (headerVideoBackgroundExists) {
      handleWithVideo($headerVideo, $headerVideoWrapper);
    }
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
      detectScrolled("down");
    } else {
      detectScrolled("up");
    }
    lastScrollTop = st;
  });
  unveilImages();
  $(".content-window-in").scroll(function () {
    $("img").unveil();
  });
  $(".CookiesOK").on("click", function (e) {
    e.preventDefault();
    shoptet.cookie.create("CookiesOK", "agreed", {
      days: $(".CookiesOK").data("cookie-notice-ttl"),
    });
    $(".cookies").fadeOut(shoptet.config.animationDuration);
    setTimeout(function () {
      $(".cookies").remove();
    }, shoptet.config.animationDuration);
    if ($(".site-msg.information").length) {
      $(".site-msg.information").css(
        "bottom",
        $(".site-msg.information").offset().left
      );
    }
  });
  $("html").on("click", "#site-agree-button", function (e) {
    e.preventDefault();
    shoptet.cookie.create(shoptet.config.agreementCookieName, "agreed", {
      days: shoptet.config.agreementCookieExpire,
    });
    shoptet.modal.close();
  });
  $(".js-close-information-msg").on("click", function () {
    shoptet.cookie.create("informationBanner", "1", { days: 1 });
    $(".site-msg.information").fadeOut(shoptet.config.animationDuration);
    setTimeout(function () {
      $(".site-msg.information").remove();
    }, shoptet.config.animationDuration);
  });
  if ($(".site-agreement").length) {
    if ($(this).hasClass("show-only")) {
      var showOnly = true;
    } else {
      var showOnly = false;
    }
    var content = $(".site-agreement").html();
    shoptet.modal.open({
      opacity: ".95",
      closeButton: showOnly,
      overlayClose: showOnly,
      html:
        shoptet.content.colorboxHeader +
        content +
        shoptet.content.colorboxFooter,
      className: shoptet.config.colorbox.classMd,
      width: shoptet.config.colorbox.widthMd,
      onClosed: function () {
        $(".site-agreement").remove();
      },
    });
  }
  $("html").on("click", ".colorbox-close", function (e) {
    e.preventDefault();
    shoptet.modal.close();
  });
  shoptet.validator.initValidator($("form"));
  $("html").on("click", "a.disabled", function (e) {
    e.preventDefault();
  });
  $("html").on("click", ".msg", function () {
    hideMsg();
  });
  $("html").on("click", ".cancel-action", function (e) {
    e.stopPropagation();
  });
  $("html").on("click", ".hide-content-windows", function (e) {
    e.preventDefault();
    shoptet.global.hideContentWindows();
  });
  $("html").on(
    "touchend click",
    ".toggle-window, .toggle-window-arr, .toggle-trigger",
    function (e) {
      if (e.type === "touchend" || !$(this).attr("data-redirect")) {
        e.preventDefault();
      }
      if ($(this).hasClass("hide-content-windows")) {
        shoptet.global.hideContentWindows();
        return;
      }
      var target = $(this).attr("data-target");
      if (!$(this).hasClass("hovered") || target === "navigation") {
        shoptet.global.showPopupWindow(target, true);
      }
      $(this).removeClass("hovered");
    }
  );
  var hidePopupWindow;
  $("html").on(
    "mouseenter",
    ".popup-widget, .hovered-nav, .menu-helper",
    function () {
      clearTimeout(hidePopupWindow);
    }
  );
  $("html").on("mouseleave", ".popup-widget, .hovered-nav", function () {
    if (
      $(this).hasClass("login-widget") ||
      $(this).hasClass("register-widget")
    ) {
      if ($(this).find("input:focus").length) {
        return false;
      }
    }
    hidePopupWindow = setTimeout(function () {
      $("body").removeClass(shoptet.config.bodyClasses);
    }, shoptet.config.animationDuration);
    $(this).removeClass("hovered");
  });
  $("html").on("mouseenter", '.toggle-window[data-hover="true"]', function (e) {
    $(this).addClass("hovered");
    e.preventDefault();
    clearTimeout(hidePopupWindow);
    var target = $(this).attr("data-target");
    if (!$("body").hasClass(target + "-window-visible")) {
      var show = target === "cart" && !$(this).hasClass("full") ? false : true;
      shoptet.global.showPopupWindow(target, show);
    }
  });
  $("html").on("mouseleave", '.toggle-window[data-hover="true"]', function () {
    if (detectResolution(shoptet.abilities.config.navigation_breakpoint)) {
      hidePopupWindow = setTimeout(function () {
        $("body").removeClass(shoptet.config.bodyClasses);
      }, shoptet.config.animationDuration);
    }
  });
  var escClasses = "";
  escClasses += ".user-action-visible, ";
  escClasses += ".top-navigation-menu-visible, ";
  escClasses += ".user-action-visible input:focus";
  $("html").on("keyup", escClasses, function (e) {
    if (e.keyCode === shoptet.common.keyCodes.escape) {
      $("body").removeClass(shoptet.config.bodyClasses);
      if ($(".overlay").length > 0) {
        $(".overlay").detach();
      }
      if ($(".msg").length > 0) {
        hideMsg();
      }
    }
  });
  $("html").on("keyup", "input, textarea", function (e) {
    e.stopPropagation();
  });
  $("#carousel").on("slide.bs.carousel", function () {
    $("#carousel img").each(function () {
      var $this = $(this);
      $this.attr("src", $this.attr("data-src"));
    });
  });
  $("html").on("click", ".js-product-clickable", function (e) {
    e.stopPropagation();
    if ($(e.target).hasClass("js-product-clickable")) {
      window.location.href = $("a.name", this).attr("href");
    }
  });
  $("html").on(
    "click",
    ".products-top .button-wrapper .toggle-top-products",
    function (e) {
      e.preventDefault();
      var $this = $(this);
      if ($this.parents().siblings(".inactive").length) {
        $this
          .parents()
          .siblings(".inactive")
          .addClass("revealed")
          .removeClass("inactive");
      } else {
        $this
          .parents()
          .siblings(".revealed")
          .addClass("inactive")
          .removeClass("revealed");
      }
      var text = $this.text();
      var hideText = text;
      var showText = $this.attr("data-text");
      toggleText($this, text, showText, hideText);
    }
  );
  $("html").on("click", ".cancel-action", function (e) {
    e.preventDefault();
    id = $(this).attr("data-id");
    if (id === "") {
      cancelAction();
    } else {
      cancelAction(id);
    }
  });
  $("html").on("change, click", "[data-unveil]", function (e) {
    var $this = $(this);
    if ($this.context.localName === "a") {
      e.preventDefault();
    }
    if ($this.attr("data-unveil") === "category-filter-hover") {
      $this.parent(".filter-section").hide();
    }
    $("#" + $this.attr("data-unveil")).toggleClass("visible");
    if ($this.attr("data-unveil") === "filters") {
      if ($("#filters").hasClass("visible")) {
        $("body").addClass("filters-visible");
      } else {
        $("body").removeClass("filters-visible");
      }
    }
    if ($this.parents(".unveil-wrapper").length) {
      $this.parents(".unveil-wrapper").toggleClass("unveiled");
    }
    if ($this.attr("data-text")) {
      toggleText($this, $this.text(), $this.text(), $this.attr("data-text"));
    }
    $("html").trigger("contentResized");
  });
  $("html").on("click", ".js-window-location", function (e) {
    e.preventDefault();
    window.location.href = $(this).attr("data-url");
  });
  initTooltips();
  initColorbox();
  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    var href = e.target.getAttribute("href");
    var $discussionForm = $(href).find(".discussion-form");
    var $discussionContent = $(href).find(".vote-wrap");
    if ($discussionForm.length) {
      if (!$discussionContent.length) {
        $(".add-comment .comment-icon").trigger("click");
      }
    }
    var external = e.target.getAttribute("data-external");
    var forceScroll = e.target.getAttribute("data-force-scroll");
    $(href + " img").unveil();
    if (external) {
      $(".shp-tabs > li").removeClass("active");
      $('.shp-tabs > li > a[href="' + href + '"]')
        .parents("li")
        .addClass("active");
    }
    if ($(this).parents(".responsive-nav").length > 0) {
      var parentUl = $(this).parents("ul:first");
      $(this)
        .parents(".responsive-nav")
        .find("ul")
        .not(parentUl)
        .find("li")
        .removeClass("active");
    }
    if (!detectResolution(shoptet.config.breakpoints.sm) || forceScroll) {
      scrollToEl($(href).parents(".shp-tabs-wrapper"));
    }
    if (typeof shoptet.products.sameHeightOfProducts === "function") {
      shoptet.products.sameHeightOfProducts();
    }
    shoptet.products.splitWidgetParameters();
  });
  $("html").on(
    "click",
    "#categories .expandable:not(.external) > a > span, #categories .expandable:not(.external) > .topic > a > span",
    function (e) {
      e.stopPropagation();
      e.preventDefault();
      $(this).closest(".expandable").toggleClass("expanded");
    }
  );
  $("html").on("click", ".link-icon.chat, .link-icon.watchdog", function (e) {
    e.preventDefault();
    shoptet.modal.open({
      href: $(this).attr("href"),
      width: shoptet.config.colorbox.widthSm,
      className: shoptet.config.colorbox.classSm,
      onComplete: function () {
        shoptet.validator.initValidator($("form"));
      },
    });
  });
  $("html").on("click", "a.colorbox, a.p-main-image.cbox", function (e) {
    e.preventDefault();
    shoptet.modal.open({
      href: $(this).attr("href"),
      maxWidth: shoptet.config.colorbox.maxWidth,
      width: shoptet.config.colorbox.widthLg,
      className: shoptet.config.colorbox.classLg,
    });
  });
  $(".link-icon.print").on("click", function (e) {
    e.preventDefault();
    window.print();
  });
  $("html").on("click", ".toggle-contacts", function () {
    toggleContacts($(this));
    $("html").trigger("contentResized");
  });
  $("html").on("click", ".toggle-contacts > a", function (e) {
    e.preventDefault();
  });
  $("html").on("click", ".share a", function (e) {
    e.preventDefault();
    window.open($(this).attr("href"), "", "width=600, height=600");
  });
  $(".html-code textarea").click(function () {
    $(this).focus().select();
  });
  $("html").on("click", ".url-generation-box .btn", function () {
    var $container = $(this).closest(".affiliate-banner");
    var $newHtmlCodeContainer = $container
      .find(".url-generation-box .html-code")
      .clone(true, true);
    var val = new String($newHtmlCodeContainer.find("textarea").val());
    $newHtmlCodeContainer
      .removeClass("no-display")
      .addClass("generated")
      .find("textarea")
      .val(val);
    $container.find(".generated").remove();
    $container.append($newHtmlCodeContainer);
  });
  if ($("#onlinePaymentButton").length) {
    if (!$("#onlinePaymentButton").parents(".suspend-redirect").length) {
      var paymentTimeout = setTimeout(function () {
        shoptet.events.paymentButtonClicked = true;
        window.location.href = $("#onlinePaymentButton").attr("href");
      }, 5e3);
    }
    $("#onlinePaymentButton").click(function () {
      if (shoptet.events.paymentButtonClicked) {
        return false;
      }
      shoptet.events.paymentButtonClicked = true;
      if (paymentTimeout) {
        clearTimeout(paymentTimeout);
      }
    });
    window.onbeforeunload = function () {
      if (typeof shoptet.events.paymentButtonClicked === "undefined") {
        return "";
      }
    };
  }
  if ($(".query-string-param").length) {
    $(".query-string-param a").click(function (e) {
      e.preventDefault();
      var params = $(this).attr("href").split("=");
      updateQueryStringParameter(params[0], params[1]);
    });
  }
  var search = window.location.search;
  if (search.length) {
    var searchValues = locationSearchToObject();
    if (searchValues.email) {
      $('input[name="email"]').val(searchValues.email);
    }
    if (searchValues.buyerName) {
      $('input[name="fullName"]').val(searchValues.buyerName);
    }
    if (searchValues.preselectStars) {
      var numberOfStars = parseInt(searchValues.preselectStars);
      $(".star-wrap .star").removeClass("star-on current").addClass("star-off");
      $(".rate-list").removeClass("current");
      $(".rate-list .star").removeClass("star-on current").addClass("star-off");
      for (var i = 1; i <= numberOfStars; i++) {
        var ratingElementStar = $('.star-wrap [data-score="' + i + '"]');
        ratingElementStar.removeClass("star-off").addClass("star-on");
        if (i === numberOfStars) {
          ratingElementStar.addClass("current");
          var rateList = $('.rate-list [data-score="' + i + '"]');
          var rateListStar = $('.rate-list[data-score="' + i + '"] .star');
          rateList.addClass("current");
          rateListStar.removeClass("star-off").addClass("star-on");
        }
      }
    }
  }
  $("html").on("click", ".js-scroll-top", function (e) {
    e.preventDefault();
    var $target;
    var $trigger = $(this);
    if (typeof $trigger.attr("data-target") !== "undefined") {
      $target = $($trigger.attr("data-target"));
    } else {
      if ($("#products").length) {
        $target = $("#products");
      } else if ($("#newsWrapper").length) {
        $target = $("#newsWrapper");
      } else if ($("#ratingWrapper").length) {
        $target = $("#ratingWrapper");
      } else if ($(".products").length) {
        $target = $(".products");
      }
    }
    if ($target.length === 0) {
      return false;
    }
    scrollToEl($target);
  });
  initDatepickers();
  if ($(".site-msg.information").length && $(".site-msg.cookies").length) {
    var msgOffset =
      $(".cookie-ag-wrap").outerHeight() +
      $(".site-msg.information").offset().left;
    $(".site-msg.information").css("bottom", msgOffset);
  }
  $(".show360image").on("click", function () {
    $(".p-thumbnails-inner a.p-thumbnail").removeClass("highlighted");
    $(this).addClass("highlighted");
    $(this).parents(".p-image-wrapper").find(".p-image").hide();
    $(this).parents(".p-image-wrapper").find(".image360").show();
  });
});
function resolveImageFormat() {
  return true;
}
(function (shoptet) {
  function hideContentWindows(target) {
    var classesToRemove = shoptet.config.bodyClasses;
    if (typeof target !== "undefined") {
      classesToRemove = classesToRemove.replace(target, "");
    }
    $("body").removeClass(classesToRemove);
  }
  function showPopupWindow(target, show) {
    shoptet.global.hideContentWindows(target);
    if (!show) {
      return false;
    }
    if (target === "cart") {
      if (!detectResolution(shoptet.config.breakpoints.md)) {
        $(".cookies").hide();
      }
      if (typeof shoptet.events.cartLoaded === "undefined") {
        shoptet.events.cartLoaded = true;
        $("body").addClass("ajax-pending");
        var callback = function () {
          if (typeof shoptet.content.initiateCheckoutData !== "undefined") {
            if (typeof fbq !== "undefined") {
              fbq(
                "track",
                "InitiateCheckout",
                shoptet.content.initiateCheckoutData
              );
              delete shoptet.content.initiateCheckoutData;
            }
          }
          $("body").removeClass("ajax-pending");
        };
        setTimeout(function () {
          shoptet.cart.getCartContent(false, callback);
        }, 0);
      }
    }
    if (target === "navigation") {
      if (!$("body").hasClass("navigation-window-visible")) {
        setTimeout(function () {
          $(document).trigger("menuUnveiled");
        }, shoptet.config.animationDuration);
      }
    }
    var currentTarget = target + "-window-visible";
    if ($("body").hasClass(currentTarget)) {
      $("body").removeClass("user-action-visible");
    } else {
      $("body").addClass("user-action-visible");
    }
    $("body").toggleClass(target + "-window-visible");
    if (target === "search" && $("body").hasClass("search-window-visible")) {
      setTimeout(function () {
        $(".content-window .search .search-form input").focus();
      }, shoptet.config.animationDuration);
    }
    if (target === "register") {
      if ($(".user-action-register .loader").length) {
        var successCallback = function (response) {
          var requestedDocument = shoptet.common.createDocumentFromString(
            response.getPayload()
          );
          var content = $(requestedDocument).find("#register-form");
          $(".user-action-register .loader").remove();
          content.appendTo(".place-registration-here");
          if (!$("#additionalInformation").hasClass("visible")) {
            toggleRequiredAttributes(
              $("#additionalInformation"),
              "remove",
              false
            );
          }
          shoptet.validator.initValidator($("#register-form"));
          initDatepickers();
          shoptet.scripts.signalDomLoad("ShoptetDOMRegisterFormLoaded");
        };
        shoptet.ajax.makeAjaxRequest(
          shoptet.config.registerUrl,
          shoptet.ajax.requestTypes.get,
          "",
          { success: successCallback },
          { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
        );
      }
    }
    $(".content-window img, .user-action img").unveil();
    $(".content-window img, .user-action img").trigger("unveil");
  }
  function updateSelectedRegions($el) {
    if ($el.attr("id") === "billCountryId") {
      inputPrefix = "bill";
      $("#billCountryIdInput").attr("disabled", true);
    } else if ($el.attr("id") === "deliveryCountryId") {
      var inputPrefix = "delivery";
      $("#deliveryCountryIdInput").attr("disabled", true);
    } else {
      return false;
    }
    var id = $el.find("option:selected").val();
    $(".region-select")
      .attr({ disabled: true, id: "", name: "" })
      .addClass("hide");
    $('.region-select[data-country="' + id + '"]')
      .attr({
        disabled: false,
        id: inputPrefix + "RegionId",
        name: inputPrefix + "RegionId",
      })
      .removeClass("hide");
  }
  function toggleRegionsWrapper() {
    var $regionsWrapper = $(".regions-wrapper");
    var allRegions = $regionsWrapper.find("select");
    var invisibleRegions = $regionsWrapper.find("select.hide");
    if (allRegions.length > invisibleRegions.length) {
      $regionsWrapper.show();
    } else {
      $regionsWrapper.hide();
    }
  }
  function restoreDefaultRegionSelect($el, val) {
    $("#billRegionIdInput").val(val);
    $(".region-select").addClass("hide");
    $el.removeClass("hide");
    shoptet.global.toggleRegionsWrapper();
  }
  shoptet.global = shoptet.global || {};
  shoptet.scripts.libs.global.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "global");
  });
})(shoptet);

(function (shoptet) {
  function toggleMenu() {
    if ($(".overlay").length === 0) {
      $('<div class="overlay" />').appendTo("body");
    } else {
      $(".overlay:not(.spinner)").detach();
    }
  }
  function splitMenu() {
    var i;
    var $menuHelper = $(".menu-helper");
    var $items = $(".navigation-in > ul > li:visible");
    var menuHelperOffset = $menuHelper.length ? $menuHelper.offset() : 0;
    var navigElems = [];
    $("#navigation").removeClass("fitted");
    $items.each(function () {
      var $el = $(this);
      var elemPos = $el.outerWidth() + $el.offset().left;
      $el.removeClass("splitted");
      navigElems.unshift({ $el: $el, elemPos: elemPos });
    });
    for (i = 0; i < navigElems.length; i++) {
      if (navigElems[i].elemPos > menuHelperOffset.left) {
        navigElems[i].$el.addClass("splitted");
      } else {
        break;
      }
    }
    if (i === 0) {
      $("#navigation").addClass("fitted");
    }
    shoptet.menu.splitHelperMenu($(".navigation-in > ul > li").length - i);
  }
  function splitHelperMenu(i) {
    var numberOfAppendedCategories = $(".menu-helper .appended-category")
      .length;
    $li = $(".menu-helper > ul > li");
    $li.each(function (index) {
      $this = $(this);
      if (i > index + numberOfAppendedCategories) {
        $this.addClass("splitted");
      } else {
        $this.removeClass("splitted");
      }
    });
    if (
      $li.length - numberOfAppendedCategories ===
      $(".menu-helper > ul > li.splitted").length
    ) {
      $(".menu-helper").addClass("empty");
    } else {
      $(".menu-helper").removeClass("empty");
    }
  }
  function showSubmenu($el) {
    $el.addClass("exp");
    $("body").addClass("submenu-visible");
    $(".has-third-level ul")
      .removeClass("has-more-items")
      .find(".more-items-trigger")
      .detach();
    if (detectResolution(shoptet.abilities.config.navigation_breakpoint)) {
      var $thirdLevelMenu = $el.find(".has-third-level ul");
      if ($thirdLevelMenu.length) {
        $(".has-third-level ul").removeClass("has-more-items");
        $thirdLevelMenu.each(function () {
          var $lastLi = $(this).find("li:last-child");
          var lastLiOffset = getRelativeOffset($lastLi);
          var lastLiBottomLine = lastLiOffset.top + $lastLi.height();
          if (lastLiBottomLine > $(this).height()) {
            $(this)
              .addClass("has-more-items")
              .append('<span class="more-items-trigger" />');
          }
        });
      }
      if (shoptet.abilities.feature.images_in_menu) {
        $el.find("img").trigger("unveil");
      }
    }
  }
  function hideSubmenu() {
    $("#navigation .ext, .menu-helper .ext").removeClass("exp");
    $("body").removeClass("submenu-visible");
  }
  function updateMenu() {
    shoptet.menu.updateMenu;
  }
  function showMenuHelper() {
    $("body").addClass("user-action-visible menu-helper-visible");
  }
  function hideMenuHelper() {
    $("body").removeClass(
      "user-action-visible menu-helper-visible submenu-visible"
    );
    $(".menu-helper .ext").removeClass("exp");
  }
  function hideNavigation() {
    $("body").removeClass(
      "user-action-visible submenu-visible navigation-window-visible"
    );
    $("#navigation .exp").removeClass("exp");
  }
  $(function () {
    var $html = $("html");
    $html.on("click", ".overlay:not(.spinner)", function () {
      shoptet.menu.toggleMenu();
      shoptet.menu.hideNavigation();
      if ($(this).hasClass("visible")) {
        hideMsg();
      }
    });
    $(".navigation-in > ul").clone().appendTo(".menu-helper");
    shoptet.runtime.menuHelper = false;
    $html.on("mouseenter", ".menu-helper", function () {
      clearTimeout(shoptet.runtime.menuHelper);
      shoptet.runtime.menuHelper = setTimeout(function () {
        if (!$("body").hasClass("menu-helper-visible")) {
          shoptet.menu.showMenuHelper();
        }
      }, shoptet.config.animationDuration);
    });
    $html.on("mouseleave", ".menu-helper", function () {
      clearTimeout(shoptet.runtime.menuHelper);
      shoptet.runtime.menuHelper = setTimeout(function () {
        shoptet.menu.hideMenuHelper();
      }, shoptet.config.animationDuration);
    });
    $html.on("click", ".menu-helper", function () {
      clearTimeout(shoptet.runtime.menuHelper);
      if ($("body").hasClass("menu-helper-visible")) {
        shoptet.menu.hideMenuHelper();
      } else {
        shoptet.menu.showMenuHelper();
      }
    });
    if (detectResolution(shoptet.abilities.config.navigation_breakpoint)) {
      shoptet.menu.updateMenu();
    }
    $html.on("touchstart", "#navigation, .navigation-buttons a", function (e) {
      e.stopPropagation();
    });
    $html.on(
      "mouseenter",
      "#navigation .ext > a > span, .menu-helper .ext > a > span",
      function (e) {
        e.stopPropagation();
      }
    );
    $html.on(
      "click",
      "#navigation .ext > a > span, .menu-helper .ext > a > span",
      function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this);
        var parentSubmenuVisible = $this.parents("li").hasClass("exp");
        setTimeout(function () {
          if (parentSubmenuVisible) {
            $this.parents("li").removeClass("exp");
          } else {
            shoptet.menu.showSubmenu($this.parents("li"));
          }
        }, 1);
      }
    );
    shoptet.runtime.submenu = false;
    $html.on("mouseover", "#navigation .ext", function () {
      var $this = $(this);
      clearTimeout(shoptet.runtime.submenu);
      shoptet.runtime.submenu = setTimeout(function () {
        if (!$this.hasClass("exp")) {
          shoptet.menu.showSubmenu($this);
        }
      }, shoptet.config.animationDuration / 2);
    });
    $html.on("mouseleave", "#navigation .ext", function () {
      if (detectResolution(shoptet.abilities.config.navigation_breakpoint)) {
        clearTimeout(shoptet.runtime.submenu);
        shoptet.menu.hideSubmenu();
      }
    });
    $html.on("touchstart click", ".navigation-close", function () {
      shoptet.menu.hideNavigation();
    });
    $html.on("click", ".more-items-trigger", function () {
      location.replace($(this).closest("ul").prev("a").attr("href"));
    });
  });
  shoptet.menu = shoptet.menu || {};
  shoptet.scripts.libs.menu.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "menu");
  });
})(shoptet);

(function (shoptet) {
  document.addEventListener("DOMContentLoaded", function () {
    var $html = $("html");
    $html.on("click", ".quantity span", function () {
      var $this = $(this);
      var $el = $this.parents(".quantity").find(".amount");
      var action = $this.attr("class");
      var callback = false;
      if (
        $el.parents(".cart-table").length ||
        $el.parents(".cart-widget-product-amount").length
      ) {
        function updateQuantityCallback() {
          shoptet.cart.updateQuantityInCart(
            $el,
            shoptet.config.updateQuantityTimeout
          );
        }
        callback = updateQuantityCallback;
      }
      shoptet.helpers.updateQuantity(
        $el[0],
        $el.data("min"),
        $el.data("max"),
        $el.data("decimals"),
        action,
        callback
      );
    });
    if ($("#ogImage").length) {
      $("#ogImage").appendTo("head");
      if ($("#ogImageOriginal").length) {
        $("#ogImageOriginal").remove();
      }
    }
    setThumbnailsDirection();
    checkThumbnails(shoptet.config.thumbnailsDirection, "set", true);
    $html.on("click", ".browse-p a:not(.inactive)", function (e) {
      e.preventDefault();
      browseProducts($(this));
    });
    $html.on("click", ".thumbnail-next", function (e) {
      e.preventDefault();
      if (!$(this).hasClass("clicked")) {
        switchThumbnails("prev");
      }
    });
    $html.on("click", ".thumbnail-prev", function (e) {
      e.preventDefault();
      if (!$(this).hasClass("clicked")) {
        switchThumbnails("next");
      }
    });
    $html.on("click", ".p-thumbnail", function (e) {
      e.preventDefault();
      replaceImage($(this).attr("href"));
    });
    $html.on("click", ".p-main-image", function (e) {
      e.preventDefault();
      var href = $(this)
        .attr("href")
        .replace(/\/orig\//, "/big/");
      $('.cbox-gal[href="' + href + '"]').trigger("click");
    });
    $(".p-intro .quantity").remove();
    $(".star-wrap .star")
      .mouseover(function () {
        returnStyle($(this));
      })
      .click(function () {
        var $a = $(this);
        var score = $a.data("score");
        changeStyle(score);
        setStyle($a);
      });
    $(".star-wrap").mouseleave(function () {
      var a = $(".star-wrap .current").index();
      returnStyle($(".star-wrap").children().eq(a));
    });
    if ($(".type-product").length) {
      shoptet.variantsSimple.handler();
      shoptet.variantsSplit.handler();
      shoptet.variantsCommon.handleBrowserValueRestoration();
    }
    $("#ratingTab .rate-form-trigger").click(function () {
      $('.rate-list[data-score="5"]')
        .addClass("current")
        .find(".star")
        .addClass("star-on")
        .removeClass("star-off");
      $(".rate-list .star").click(function () {
        var $a = $(this);
        var score = $a.parents(".rate-list").data("score");
        changeStyle(score);
        setStyle($(".star-wrap .star:nth-child(" + score + ")"));
      });
    });
    $(".productRatingAction").on("click", function () {
      var successCallback = function (response) {
        $(".stars-wrapper").html(response.getPayload());
        initTooltips();
      };
      var dataString =
        "productId=" +
        $(this).data("productid") +
        "&score=" +
        $(this).data("score");
      shoptet.ajax.makeAjaxRequest(
        shoptet.config.rateProduct,
        shoptet.ajax.requestTypes.post,
        dataString,
        { success: successCallback },
        { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
      );
      return false;
    });
    $("#productDiscussion .add-comment").click(function () {
      $("#productDiscussion .add-comment").show();
      $(this).hide();
      $(".discussion-form").show();
      moveElementAfterSelector($(".discussion-form"), $(this));
      $('.discussion-form input[name="parentId"]').remove();
      if ($(this).attr("data-id")) {
        $(
          '<input name="parentId" value="' +
            $(this).data("id") +
            '" type="hidden">'
        ).insertAfter('.discussion-form input[name="productId"]');
      }
    });
    $html.on("click", ".load-products", function (e) {
      shoptet.scripts.signalCustomEvent(
        "ShoptetPageMoreProductsRequested",
        e.target
      );
      var $el = $(".pagination .current");
      showSpinner();
      $.ajax({
        type: "POST",
        url: $el.next("a").attr("href"),
        headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
        success: function (payload) {
          var requestedDocument = shoptet.common.createDocumentFromString(
            payload
          );
          shoptet.tracking.trackProductsFromPayload(requestedDocument);
          var listing = $(requestedDocument).find(".products-page > .product");
          var pagination = $(requestedDocument).find(".pagination-wrapper");
          var $productsWrapper = $(".products-page");
          if (listing !== null) {
            $productsWrapper.last().append(listing);
            $(".pagination-wrapper").replaceWith(pagination);
            sameHeightOfProducts();
            shoptet.products.splitWidgetParameters();
            initTooltips();
            setTimeout(function () {
              $(".products-page img").unveil();
            }, 1);
            history.pushState(null, null, this.url);
            if ("scrollRestoration" in history) {
              history.scrollRestoration = "manual";
            }
            hideSpinner();
          }
          shoptet.scripts.signalDomLoad(
            "ShoptetDOMPageMoreProductsLoaded",
            $productsWrapper[0]
          );
        },
      });
    });
    $html.on("click", ".js-share-buttons-trigger", function (e) {
      e.preventDefault();
      $(".social-buttons").toggleClass("no-display");
    });
  });
  window.addEventListener("load", function () {
    shoptet.products.splitWidgetParameters();
  });
  function splitWidgetParameters() {
    var wrappers = document.querySelectorAll(".widget-parameter-wrapper");
    for (var i = 0; i < wrappers.length; i++) {
      shoptet.products.splitSingleWidgetParameter(wrappers[i]);
    }
  }
  function splitSingleWidgetParameter(wrapper) {
    var list = wrapper.querySelector(".widget-parameter-list");
    var values = wrapper.querySelectorAll(".widget-parameter-value");
    var moreEl = wrapper.querySelector(".widget-parameter-more");
    var valuesToHide = [];
    wrapper.classList.remove("justified");
    moreEl.classList.remove("no-display");
    moreEl.classList.remove("visible");
    shoptet.common.removeClassFromElements(values, "no-display");
    if (!shoptet.common.fitsToParentWidth(list)) {
      var moreElWidth = moreEl.offsetWidth;
      for (var i = 0; i < values.length; i++) {
        if (!shoptet.common.fitsToParentWidth(values[i], moreElWidth)) {
          valuesToHide = [].slice.call(values, i);
          break;
        }
      }
      shoptet.common.addClassToElements(valuesToHide, "no-display");
      if (valuesToHide.length === values.length) {
        moreEl.classList.add("no-display");
      } else {
        moreEl.classList.add("visible");
      }
    } else {
      moreEl.classList.add("no-display");
    }
    wrapper.classList.add("justified");
  }
  function replaceImage(bigImage) {
    var $mainImage = $(".p-image-wrapper .p-image");
    if ($(".image360").length) {
      $(".image360").hide();
    }
    $mainImage.show();
    var $mainImageLink = $mainImage.find("a");
    var currentImage = bigImage.split("/");
    if (typeof currentImage === "object") {
      var lastItem = currentImage[currentImage.length - 1];
      var imageName = lastItem.split("?");
      highlightActiveThumbnail(imageName[0]);
    }
    $mainImage.find("img").attr("src", bigImage);
    $mainImageLink.attr({
      href: bigImage,
      "data-href": bigImage.replace(/big/, "/orig/"),
    });
    if ($(".cloud-zoom").length) {
      clearTimeout(shoptet.runtime.cloudZoom);
      shoptet.runtime.cloudZoom = setTimeout(function () {
        $(".cloud-zoom").data("zoom").destroy();
        $(".cloud-zoom").CloudZoom(shoptet.config.cloudZoomOptions);
      }, 201);
    }
  }
  function highlightActiveThumbnail(imageName) {
    $(".p-thumbnails-inner a.show360image").removeClass("highlighted");
    $(".p-thumbnails-inner a.p-thumbnail").each(function () {
      if ($(this).attr("href").indexOf(imageName) !== -1) {
        $(".p-thumbnails-inner a.p-thumbnail").removeClass("highlighted");
        $(this).addClass("highlighted");
        return false;
      }
    });
  }
  function browseProducts($el) {
    if ($el.hasClass("p-all")) {
      $el.addClass("inactive");
      var pSwitchable = $el.parents(".browse-p").prev(".p-switchable");
      pSwitchable
        .addClass("show-all-related")
        .find(".product")
        .find("img")
        .unveil();
      return false;
    }
    var products = $el
      .parents(".browse-p")
      .prev(".p-switchable")
      .find(".product");
    var productsLength = products.length;
    var firstActive, firstInactive;
    var activeProducts =
      shoptet.abilities.config.number_of_active_related_products;
    for (var i = 0; i < productsLength; i++) {
      if (
        typeof firstActive === "undefined" &&
        $(products[i]).hasClass("active")
      ) {
        firstActive = i;
      }
      if (
        typeof firstInactive === "undefined" &&
        $(products[i]).hasClass("inactive")
      ) {
        firstInactive = i;
      }
      if (
        typeof firstActive !== "undefined" &&
        typeof firstInactive !== "undefined"
      ) {
        break;
      }
    }
    if ($el.hasClass("p-next")) {
      if (productsLength - activeProducts - firstActive > 0) {
        $(products[firstActive]).addClass("inactive").removeClass("active");
        $(products[firstActive + activeProducts])
          .addClass("active")
          .removeClass("inactive")
          .find("img")
          .unveil();
      }
      if (productsLength - activeProducts - firstActive > 1) {
        $el.prev(".p-prev").removeClass("inactive");
      } else {
        $el.addClass("inactive");
      }
      if (productsLength - activeProducts - firstActive === 1) {
        $el.prev(".p-prev").removeClass("inactive");
      }
    }
    if ($el.hasClass("p-prev")) {
      if (firstActive + activeProducts <= productsLength) {
        $(products[firstActive - 1])
          .addClass("active")
          .removeClass("inactive")
          .find("img")
          .unveil();
        $(products[firstActive - 1 + activeProducts])
          .addClass("inactive")
          .removeClass("active");
      }
      if (firstActive === 1) {
        $el.addClass("inactive");
      }
      $el.next(".p-next").removeClass("inactive");
    }
  }
  function setThumbnailsDirection() {
    if (
      shoptet.abilities.feature.directional_thumbnails &&
      $("#content.wide").length
    ) {
      if (detectResolution(shoptet.config.breakpoints.sm)) {
        setThumbnails("vertical");
      } else {
        setThumbnails("horizontal");
      }
    } else {
      setThumbnails("horizontal");
    }
  }
  function setThumbnails(direction) {
    shoptet.config.thumbnailsDirection = direction;
    $(".p-thumbnails").removeClass(
      "p-thumbnails-horizontal p-thumbnails-vertical"
    );
    $(".p-thumbnails").addClass("p-thumbnails-" + direction);
  }
  function checkThumbnailsAction(
    $thumbnailsWrapper,
    diff,
    thumbnailsWrapperDimensions,
    thumbnailsScroll
  ) {
    if (diff > thumbnailsWrapperDimensions) {
      $thumbnailsWrapper.addClass("overflow-next");
    } else {
      $thumbnailsWrapper.removeClass("overflow-next");
    }
    if (thumbnailsScroll < 0) {
      $thumbnailsWrapper.addClass("overflow-prev");
    } else {
      $thumbnailsWrapper.removeClass("overflow-prev");
    }
  }
  function checkThumbnails(direction, action, reset) {
    var $thumbnailsWrapper = $(".p-thumbnails");
    var $thumbnails = $(".p-thumbnails-inner > div");
    var $thumbnailsInner = $(".p-thumbnails-inner");
    if (direction == "horizontal") {
      var thumbnailsWrapperDimensions = $thumbnailsWrapper.width();
      var thumbnailsDimensions = $thumbnails.width();
      var thumbnailsScroll = parseInt($thumbnailsInner.css("left"));
    } else {
      var thumbnailsWrapperDimensions = $thumbnailsWrapper.height();
      var thumbnailsDimensions = $thumbnails.height();
      var thumbnailsScroll = parseInt($thumbnailsInner.css("top"));
    }
    var diff = thumbnailsDimensions + thumbnailsScroll;
    var sizes = {
      thumbnailsScroll: thumbnailsScroll,
      thumbnailsDimensions: thumbnailsDimensions,
      thumbnailsWrapperDimensions: thumbnailsWrapperDimensions,
      diff: diff,
    };
    if (action == "check") {
      return sizes;
    } else {
      if (reset == true) {
        if (direction == "horizontal") {
          $thumbnailsInner.css("left", 0);
        } else {
          $thumbnailsInner.css("top", 0);
        }
        setTimeout(function () {
          checkThumbnailsAction(
            $thumbnailsWrapper,
            diff,
            thumbnailsWrapperDimensions,
            thumbnailsScroll
          );
        }, shoptet.config.animationDuration);
      } else {
        checkThumbnailsAction(
          $thumbnailsWrapper,
          diff,
          thumbnailsWrapperDimensions,
          thumbnailsScroll
        );
      }
    }
  }
  function switchThumbnails(direction) {
    var sizes = checkThumbnails(
      shoptet.config.thumbnailsDirection,
      "check",
      false
    );
    var $el = $(".p-thumbnails-inner");
    $(".thumbnail-next, .thumbnail-prev").addClass("clicked");
    if (shoptet.config.thumbnailsDirection == "horizontal") {
      var thumbnailsScroll = "left";
    } else {
      var thumbnailsScroll = "top";
    }
    if (direction == "prev") {
      if (
        sizes["diff"] - sizes["thumbnailsWrapperDimensions"] <
        sizes["thumbnailsWrapperDimensions"]
      ) {
        var thumbnailsScrollVar =
          sizes["thumbnailsDimensions"] - sizes["thumbnailsWrapperDimensions"];
      } else {
        var thumbnailsScrollVar =
          -parseInt($el.css(thumbnailsScroll)) +
          sizes["thumbnailsWrapperDimensions"];
      }
      $el.css(thumbnailsScroll, -thumbnailsScrollVar);
    } else {
      $(".thumbnail-next").addClass("clicked");
      if (
        sizes["thumbnailsScroll"] + sizes["thumbnailsWrapperDimensions"] >
        0
      ) {
        var thumbnailsScrollVar = 0;
      } else {
        var thumbnailsScrollVar =
          sizes["thumbnailsWrapperDimensions"] + sizes["thumbnailsScroll"];
      }
      $el.css(thumbnailsScroll, thumbnailsScrollVar);
    }
    setTimeout(function () {
      checkThumbnails(shoptet.config.thumbnailsDirection, "set", false);
      $el.find("img").unveil();
      $(".thumbnail-next, .thumbnail-prev").removeClass("clicked");
    }, shoptet.config.animationDuration);
  }
  function checkDiscountFlag() {
    var $flag = $(".p-image-wrapper .flags-extra .flag-discount");
    if ($flag.length) {
      var childVisible = true;
      $flag.find(".empty").each(function () {
        if (!$(this).hasClass("no-display")) {
          childVisible = false;
          return false;
        }
      });
      if (childVisible) {
        $flag.removeClass("no-display");
      } else {
        $flag.addClass("no-display");
      }
    }
  }
  function changeStyle(score) {
    $(".star.current, .rate-list.current").removeClass("current");
    $('.star-wrap .star[data-score="' + score + '"]').addClass("current");
    $('.rate-list[data-score="' + score + '"]').addClass("current");
    $(".rate-list .star.star-on").removeClass("star-on").addClass("star-off");
    $(".rate-list.current .star").addClass("star-on").removeClass("star-off");
    $('input[name="score"]').val(score);
  }
  function setStyle($selector) {
    $selector
      .removeClass("star-off")
      .addClass("star-on")
      .prevAll()
      .removeClass("star-off")
      .addClass("star-on");
    $selector.nextAll().removeClass("star-on").addClass("star-off");
  }
  function returnStyle($selector) {
    $(".star-wrap .star.star-on").removeClass("star-on").addClass("star-off");
    setStyle($selector);
  }
  function sameHeightOfProductsLoop(target) {
    var maxHeight = 0;
    $(target).each(function () {
      var currentHeight = $(this).outerHeight();
      if (currentHeight > maxHeight) {
        maxHeight = currentHeight;
      }
    });
    $(target).css("height", maxHeight);
  }
  function setHeightOfBigProduct() {
    var $el = $(".products-block.big .p.big");
    if (!$el.length) {
      return;
    }
    if (detectResolution(shoptet.config.breakpoints.xl)) {
      var $sibling = $(".products-block.big .p:not(.big)").first();
      var $siblingsWrapper = $(".products-block.big > div:nth-child(2)");
      var siblingWrapperPadding = parseInt(
        $siblingsWrapper.css("padding-bottom")
      );
      var siblingsHeight = $sibling[0].getBoundingClientRect().height;
      $el.css("min-height", siblingsHeight * 2 + siblingWrapperPadding);
    }
  }
  function sameHeightOfProducts() {
    if (shoptet.abilities.config.category.product.same_height_set) {
      var notBigP = ".products-block:not(.big) .p";
      var bigP = ".products-block.big .p:not(.big)";
      $(bigP).removeAttr("style");
      $(notBigP).removeAttr("style");
      var breakpoint =
        shoptet.abilities.config.category.product.same_height_breakpoint;
      if (detectResolution(shoptet.config.breakpoints[breakpoint])) {
        if ($(notBigP).length) {
          sameHeightOfProductsLoop(notBigP);
        }
        if ($(bigP).length) {
          sameHeightOfProductsLoop(bigP);
        }
      }
      setHeightOfBigProduct();
    }
  }
  shoptet.products = shoptet.products || {};
  shoptet.scripts.libs.products.forEach(function (fnName) {
    var fn = eval(fnName);
    shoptet.scripts.registerFunction(fn, "products");
  });
})(shoptet);

function fulltextSearch($searchInput, $searchContainer) {
  var $form = $searchInput.parents("form");
  var xhr;
  $searchInput.keyup(function () {
    if ($searchInput.val().indexOf(" ") == -1) {
      $(".search-whisperer-empty").hide();
    }
    delay(function () {
      if ($searchInput.val().length > 2) {
        if (!xhr || xhr.readyState === 4) {
          xhr = $.ajax({
            url: "/action/ProductSearch/ajaxSearch/",
            type: "GET",
            headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
            data: $form.serialize(),
          })
            .done(function (result) {
              var response = $.parseJSON(result);
              $searchContainer.html(response);
              $searchContainer.addClass("active");
              $searchContainer.slideDown(shoptet.config.animationDuration);
              if ($searchInput.val().indexOf(" ") != -1) {
                $(".search-whisperer-empty").show();
              }
            })
            .fail(function () {
              $searchContainer.slideDown(shoptet.config.animationDuration);
            });
        }
      } else if ($searchInput.val().length <= 2) {
        clearSearchWhisperer();
      }
    }, 500);
  });
  $searchContainer.click(function (e) {
    if (!$(e.target).hasClass("whisperer-trigger")) {
      e.stopPropagation();
    }
  });
  $(document).click(function () {
    clearSearchWhisperer();
  });
  function clearSearchWhisperer() {
    $searchContainer.removeClass("active");
    $searchContainer.empty();
    return false;
  }
}
function checkMinimalLength($el) {
  var passed = true;
  var length = $el.val().length;
  if ((length < 3 && length > 0) || length == 0) {
    showMessage(shoptet.messages["charsNeeded"], "warning", "", false, false);
    passed = false;
  }
  return passed;
}
function detectRecommended() {
  return $(".recommended-products .row").length;
}
function hideRecommended() {
  $(".recommended-products .browse, .recommended-products .indicator").detach();
}
function updateIndicator(className) {
  var $indicator = $(".recommended-products .indicator");
  var indicatorClasses = "indicator-1 indicator-2";
  if (className === false) {
    $indicator.removeClass(indicatorClasses);
  } else {
    $indicator.removeClass(indicatorClasses).addClass(className);
  }
}
function switchRecommended(target) {
  if (detectRecommended() > 1) {
    var $el = $(".recommended-products .row.active");
    var $arrows = $(".recommended-products .browse");
    if (target === "prev") {
      var $targetEl = $el.prev(".row");
      var $targetElSibling = $targetEl.prev(".row");
      var $arrow = $(".recommended-products .prev");
      var indicatorClassName = "indicator-prev";
    } else {
      var $targetEl = $el.next(".row");
      var $targetElSibling = $targetEl.next(".row");
      var $arrow = $(".recommended-products .next");
      var indicatorClassName = "indicator-next";
    }
    if ($targetEl.length > 0) {
      $arrows.removeClass("inactive");
      $el.removeClass("active");
      $targetEl.addClass("active");
      $(".recommended-products img").unveil();
      if ($targetElSibling.length < 1) {
        $arrow.addClass("inactive");
        if (indicatorClassName === "indicator-prev") {
          updateIndicator(false);
        } else {
          updateIndicator("indicator-2");
        }
      } else {
        updateIndicator("indicator-1");
      }
    } else {
    }
  } else {
  }
}
$(function () {
  var $searchInput = $(".search input.query-input");
  if ($searchInput.length) {
    $searchInput.after('<div class="search-whisperer"></div>');
    fulltextSearch($searchInput, $(".search-whisperer"));
  }
  $("html").on("click", ".whisperer-trigger", function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).parents(".search-form").submit();
  });
  $("html").on("focus", '.search-form input[type="search"]', function () {
    if (
      shoptet.abilities.feature.focused_search_window &&
      !$("body").hasClass("search-window-visible")
    ) {
      shoptet.global.showPopupWindow("search", true);
    }
  });
  $("html").on("click", "#loadNextSearchResults", function (e) {
    e.preventDefault();
    $(this).after('<div class="loader static accented" />');
    $(this).remove();
    var offset = $(e.target).data("offset");
    var string = $(e.target).data("string");
    $.ajax({
      url:
        "/action/productSearch/ajaxNextContent?string=" +
        string +
        "&offset=" +
        offset,
      headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
      async: true,
      timeout: 150800,
      dataType: "html",
      success: function (data, textStatus, xOptions) {
        $(".search-next-wrap").remove();
        $("#products-found").append(data).fadeIn("slow");
        $("#products-found img").unveil();
        initTooltips();
        shoptet.scripts.signalDomLoad("ShoptetDOMPageContentLoaded");
      },
    });
  });
  $("html").on("click", ".display-results-group", function (e) {
    e.preventDefault();
    $list = $(this).siblings(".search-results-group-list");
    $list.find(".no-display").removeClass("no-display");
    $(this).hide();
  });
  $("html").on("submit", ".search-form", function () {
    if (!checkMinimalLength($(this).find('input[type="search"]'))) {
      return false;
    }
  });
  if (detectRecommended() < 1) {
    hideRecommended();
  }
  $("html").on("click", ".recommended-products .browse", function (e) {
    e.preventDefault();
    if ($(this).hasClass("prev")) {
      switchRecommended("prev");
    } else {
      switchRecommended("next");
    }
  });
});

var priceFilter = function (categoryMinValue, categoryMaxValue) {
  var selectedValues = parseFilterValuesFromContent(),
    selectedMinValue = selectedValues[0],
    selectedMaxValue = selectedValues[1];
  formatFilterValues(selectedMinValue, selectedMaxValue);
  $("#slider").slider({
    range: true,
    min: categoryMinValue,
    max: categoryMaxValue,
    values: [selectedMinValue, selectedMaxValue],
    slide: function (event, ui) {
      if (categoryMaxValue - categoryMinValue < 2) {
        return false;
      }
      var slidedMinValue = ui.values[0].toString(),
        slidedMaxValue = ui.values[1].toString();
      formatFilterValues(slidedMinValue, slidedMaxValue);
    },
    stop: function (event, ui) {
      if (categoryMaxValue - categoryMinValue < 2) {
        return false;
      }
      var rawSlidedMinValue =
        shoptet.helpers.toFloat(ui.values[0]) / currencyExchangeRate;
      var rawSlidedMaxValue =
        shoptet.helpers.toFloat(ui.values[1]) / currencyExchangeRate;
      var slidedMinValue = Math.round(rawSlidedMinValue);
      var slidedMaxValue = Math.round(rawSlidedMaxValue);
      $("#price-value-min").attr("value", slidedMinValue);
      $("#price-value-max").attr("value", slidedMaxValue);
      var url = window.location.href.split("?")[0];
      var queryVars = window.location.search.replace("?", "").split("&");
      var filteredQueryVars = [];
      var queryPair;
      url = url.replace(shoptet.content.regexp, "");
      for (var idx = 0; idx < queryVars.length; idx++) {
        queryPair = queryVars[idx].split("=");
        if (
          queryPair[0] === "" ||
          queryPair[0] === "priceMin" ||
          queryPair[0] === "priceMax"
        ) {
          continue;
        }
        filteredQueryVars.push({
          key: queryPair[0],
          value: queryPair[1],
          toString: function () {
            return this.key + "=" + this.value;
          },
        });
      }
      if (filteredQueryVars.length > 0) {
        url += "?" + filteredQueryVars.join("&");
      }
      var urlValuePriceMin;
      var urlValuePriceMax;
      if (currencyExchangeRate === 1) {
        urlValuePriceMin = slidedMinValue;
        urlValuePriceMax = slidedMaxValue;
      } else {
        urlValuePriceMin = (Math.round(rawSlidedMinValue * 100) / 100).toFixed(
          2
        );
        urlValuePriceMax = (Math.round(rawSlidedMaxValue * 100) / 100).toFixed(
          2
        );
      }
      url += url.split("?")[1] ? "&" : "?";
      url += "priceMin=" + urlValuePriceMin + "&priceMax=" + urlValuePriceMax;
      makeFilterAjaxRequest(
        url,
        true,
        false,
        event.target,
        "ShoptetPagePriceFilterChange"
      );
    },
  });
};
function makeFilterAjaxRequest(
  url,
  pushHistoryState,
  successCallback,
  element,
  event
) {
  showSpinner();
  pushHistoryState =
    typeof pushHistoryState !== "undefined" ? pushHistoryState : true;
  shoptet.scripts.signalCustomEvent(event, element);
  $.ajax({
    url: url,
    type: "GET",
    headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
    dataType: "html",
    timeout: 1e4,
    cache: true,
    success: function (payload) {
      var requestedDocument = shoptet.common.createDocumentFromString(payload);
      shoptet.tracking.trackProductsFromPayload(requestedDocument);
      var payloadContent = $(requestedDocument).find("#content");
      var $payloadContentWrapper = $("#content");
      $payloadContentWrapper.html(payloadContent[0].innerHTML);
      if ($(requestedDocument).find("#filters").length) {
        var payloadFilterContent = $(requestedDocument).find("#filters");
        if (!$("#filters").length) {
          $("#category-header").after('<div id="filters" />');
        }
        $("#filters").html(payloadFilterContent[0].innerHTML);
      }
      if ($(requestedDocument).find(".breadcrumbs").length) {
        var payloadNavContent = $(requestedDocument)
          .find(".breadcrumbs")
          .clone();
        $(".breadcrumbs").html(payloadNavContent[0].innerHTML);
      }
      if ($(requestedDocument).find(".header-title").length) {
        var payloadH1Content = $(requestedDocument)
          .find(".header-title")
          .clone();
        $(".header-title").html(payloadH1Content[0].innerHTML);
      }
      var $categoryMinValue = $("#categoryMinValue");
      var $categoryMaxValue = $("#categoryMaxValue");
      if ($categoryMinValue.length) {
        categoryMinValue = parseInt($categoryMinValue.text());
      }
      if ($categoryMaxValue.length) {
        categoryMaxValue = parseInt($categoryMaxValue.text());
      }
      priceFilter(categoryMinValue, categoryMaxValue);
      $("#content-wrapper img").unveil();
      detectFilters();
      initTooltips();
      hideSpinner();
      dismissMessages();
      setTimeout(function () {
        shoptet.products.sameHeightOfProducts();
      }, 1e3);
      shoptet.products.splitWidgetParameters();
      try {
        if (pushHistoryState) {
          if ($(".breadcrumbs").length) {
            var $selector = $(".breadcrumbs > span:last");
            var current = $selector.find("span").data("title");
            var baseTitle = $("#navigation-first").data("basetitle");
            document.title = current + " - " + baseTitle;
            history.pushState(
              null,
              null,
              $selector.find("meta").attr("content")
            );
          } else {
            history.pushState(null, null, url);
          }
          if ("scrollRestoration" in history) {
            history.scrollRestoration = "auto";
          }
        } else {
          document.title = $('meta[property="og:title"]').attr("content");
        }
      } catch (err) {}
      if (typeof successCallback === "function") {
        successCallback();
      }
      shoptet.scripts.signalDomLoad(
        "ShoptetDOMPageContentLoaded",
        $payloadContentWrapper[0]
      );
    },
    error: function () {
      hideSpinner();
      $("html, body").animate(
        { scrollTop: 0 },
        shoptet.config.animationDuration,
        function () {
          showMessage(
            shoptet.messages["ajaxError"],
            "warning",
            "",
            false,
            false
          );
        }
      );
    },
  });
}
function moveFilters($el, targetLocation) {
  if (targetLocation != "default") {
    $("#filters-wrapper").after($el);
  } else {
    $("#filters-default-position").after($el);
  }
}
function detectFilters() {
  if ($(".filters-wrapper").length) {
    $el = $(".filters-wrapper");
    var filtersDefaultPosition = $("#filters-default-position").attr(
      "data-filters-default-position"
    );
    if (filtersDefaultPosition == "left" || filtersDefaultPosition == "right") {
      var $asideFilterSelector = $(
        ".sidebar-" + filtersDefaultPosition + " .filters-wrapper"
      );
      if ($asideFilterSelector.length && !$asideFilterSelector.is(":visible")) {
        moveFilters($el, "content");
      } else {
        moveFilters($el, "default");
      }
    }
  }
}
var parseFilterValuesFromContent = function () {
  var values = [];
  values[0] = $("#min").text().toString();
  values[1] = $("#max").text().toString();
  return values;
};
var formatFilterValues = function (selectedMinValue, selectedMaxValue) {
  var reverseNumberMin = "",
    finalNumberMin = "",
    reverseNumberMax = "",
    finalNumberMax = "";
  for (var i = selectedMinValue.length; i >= 0; i--) {
    reverseNumberMin = reverseNumberMin + selectedMinValue.charAt(i);
  }
  var formatedNumber = reverseNumberMin.replace(
    /(.{3})/g,
    "$1" + shoptet.config.thousandSeparator
  );
  for (var i = formatedNumber.length; i >= 0; i--) {
    finalNumberMin = finalNumberMin + formatedNumber.charAt(i);
  }
  for (var i = selectedMaxValue.length; i >= 0; i--) {
    reverseNumberMax = reverseNumberMax + selectedMaxValue.charAt(i);
  }
  var formatedMaxNumber = reverseNumberMax.replace(
    /(.{3})/g,
    "$1" + shoptet.config.thousandSeparator
  );
  for (var i = formatedMaxNumber.length; i >= 0; i--) {
    finalNumberMax = finalNumberMax + formatedMaxNumber.charAt(i);
  }
  $("#min").text(finalNumberMin);
  $("#max").text(finalNumberMax);
};
$(function () {
  var $html = $("html");
  if ($(".filters").length) {
    window.onpopstate = function () {
      makeFilterAjaxRequest(
        location.href,
        false,
        false,
        document,
        "ShoptetPageFiltersRecalledFromHistory"
      );
    };
  }
  if ($("#slider").length) {
    priceFilter(categoryMinValue, categoryMaxValue);
  }
  $html.on(
    "click",
    ".filter-section input, .active-filters .input",
    function (e) {
      makeFilterAjaxRequest(
        e.target.getAttribute("data-url"),
        true,
        false,
        e.target,
        "ShoptetPageFilterValueChange"
      );
    }
  );
  $html.on("click", "div.category-header input", function (e) {
    makeFilterAjaxRequest(
      e.target.getAttribute("data-url"),
      true,
      false,
      e.target,
      "ShoptetPageSortingChanged"
    );
  });
  $html.on("click", "p#clear-filters a", function (e) {
    e.preventDefault();
    makeFilterAjaxRequest(
      e.target.getAttribute("href"),
      true,
      false,
      e.target,
      "ShoptetPageFiltersCleared"
    );
  });
  $html.on("click", "div.pagination a", function (e) {
    e.preventDefault();
    var $scrollTarget = false;
    var ajaxCallback = false;
    if ($(".products:not(.products-top)").length) {
      $scrollTarget = $(".products:not(.products-top)");
    } else if ($("#newsWrapper").length) {
      $scrollTarget = $("#newsWrapper");
    } else if ($("#ratingWrapper").length) {
      $scrollTarget = $("#ratingWrapper");
    }
    if ($scrollTarget) {
      ajaxCallback = scrollToEl($scrollTarget);
    }
    makeFilterAjaxRequest(
      e.target.getAttribute("href"),
      true,
      ajaxCallback,
      e.target,
      "ShoptetPagePaginationUsed"
    );
  });
  if ($(".sidebar-right .filters-wrapper").length) {
    $(".sidebar-right").addClass("has-categories");
  }
  detectFilters();
});

$(document)
  .on("mouseenter", ".swap-images", function () {
    var img = $(this).find(".swap-image");
    if (img.attr("data-next")) {
      img.attr("src", img.attr("data-next"));
    }
  })
  .on("mouseleave", ".swap-images", function () {
    var img = $(this).find(".swap-image");
    if (img.attr("data-next")) {
      img.attr("src", img.attr("data-src"));
    }
  });

if (shoptet.abilities.feature.smart_labels) {
  (function ($) {
    $.fn.SmartLabels = function (options) {
      var defaults = {
          smartLabelClass: "smart-label-wrapper",
          populatedClass: "populated",
          focusedClass: "focused",
        },
        settings = $.extend({}, defaults, options);
      var invalidTypes = ["radio", "checkbox", "hidden", "submit"];
      return this.each(function () {
        var element = $(this),
          input = element.find("textarea, input, select");
        if ($(input[1]).attr("type") == "tel") {
          input = $(input[1]);
        }
        if (invalidTypes.indexOf(input.attr("type")) == -1) {
          element.addClass(settings.smartLabelClass);
          if (input.val() == "") {
            element.removeClass(settings.populatedClass);
          } else {
            element.addClass(settings.populatedClass);
          }
          input.on("focus", function () {
            element.addClass(settings.focusedClass);
          });
          input.on("blur", function () {
            element.removeClass(settings.focusedClass);
            if (!input.val()) {
              element.removeClass(settings.populatedClass);
            }
          });
          input.on("keyup", function () {
            element.addClass(settings.populatedClass);
          });
        }
      });
    };
  })(jQuery);
  $(document).ready(function () {
    $("#checkoutContent .form-group").SmartLabels();
    $("#register-form .form-group").SmartLabels();
  });
}
