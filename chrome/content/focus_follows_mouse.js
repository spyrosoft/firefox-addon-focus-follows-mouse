window.addEventListener(
	'load',
	function load(event) {
		window.removeEventListener('load', load, false);
		focus_follows_mouse.init();
	},
	false
);

var focus_follows_mouse = {
	
	previous_page_scroll_value : 0,
	previous_mouse_position_x : 0,
	previous_mouse_position_y : 0,
	
	init : function()
	{
		gURLBar.addEventListener(
			'mouseover',
			function() {
				var preferences = Components.classes['@mozilla.org/preferences-service;1']
					.getService(Components.interfaces.nsIPrefService)
					.getBranch('extensions.focus_follows_mouse.');
				var disable_url_bar = preferences.getBoolPref('disable_url_bar');
				if ( ! disable_url_bar) {
					this.focus();
				}
			},
			false
		);
		
		var searchbar_element = document.getElementById('searchbar');
		if (searchbar_element) {
			searchbar_element.addEventListener(
				'mouseover',
				function() {
					this.focus();
				},
				true
			);
		}
		
		var appcontent = document.getElementById('appcontent');
		
		appcontent.addEventListener(
			'DOMContentLoaded',
			focus_follows_mouse.on_page_load,
			false
		);
	},
	
	on_page_load : function()
	{
		content.window.addEventListener(
			'mouseover',
			focus_follows_mouse.element_hovered,
			false
		);
	},
	
	element_hovered : function(event)
	{
		if (focus_follows_mouse.page_content_selected()) {
			return;
		}
		if (event.buttons) {
			return;
		}
		if ( ! focus_follows_mouse.page_scrolled()
		&& focus_follows_mouse.mouse_moved(event)) {
			focus_follows_mouse.focus_hovered_element_if_tag_is_specified(event);
		}
	},
	
	page_content_selected : function()
	{
		if (content.document.getSelection().toString() == '') {
			return false;
		} else {
			return true;
		}
	},
	
	page_scrolled : function()
	{
		var page_scrolled;
		
		if (content.window.pageYOffset != focus_follows_mouse.previous_page_scroll_value) {
			page_scrolled = true;
		} else {
			page_scrolled = false;
		}
		
		focus_follows_mouse.previous_page_scroll_value = content.window.pageYOffset;
		
		return page_scrolled;
	},
	
	mouse_moved : function(event)
	{
		if (focus_follows_mouse.previous_mouse_position_x == event.clientX
		&& focus_follows_mouse.previous_mouse_position_y == event.clientY) {
			return false;
		}
		
		focus_follows_mouse.previous_mouse_position_x = event.clientX;
		focus_follows_mouse.previous_mouse_position_y = event.clientY;
		
		return true;
	},
	
	focus_hovered_element_if_tag_is_specified : function(event)
	{
		var hovered_element = event.target;
		if (hovered_element.tagName == 'INPUT'
		|| hovered_element.tagName == 'SELECT'
		|| hovered_element.tagName == 'TEXTAREA'
		|| hovered_element.tagName == 'BUTTON') {
			hovered_element.focus();
		} else if (hovered_element.getAttribute('for')) {
			if (hovered_element.tagName == 'LABEL') {
				var associated_element_id = hovered_element.getAttribute('for');
				if (associated_element_id) {
					var element_to_focus = content.document.getElementById(associated_element_id);
					if (element_to_focus) {
						element_to_focus.focus();
					}
				}
			}
		}
	}
	
};
