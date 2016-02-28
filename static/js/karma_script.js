$(function(){

	var filemanager = $('.filemanager'),
		breadcrumbs = $('.breadcrumbs'),
		fileList = filemanager.find('.data');

	// Start by fetching the file data from scan route with an AJAX request

	$.get('scan', function(data) {

		var response = [data],
			currentPath = '',
			breadcrumbsUrls = [];

		var folders = [],
			files = [];

		// This event listener monitors changes on the URL. We use it to
		// capture back/forward navigation in the browser.

		$(window).on('hashchange', function(){
			$('.modal').remove();
			goto(window.location.hash);

			// We are triggering the event. This will execute
			// this function on page load, so that we show the correct folder:

		}).trigger('hashchange');


		// Hiding and showing the search box

		filemanager.find('.search').click(function(){

			var search = $(this);

			search.find('span').hide();
			search.find('input[type=search]').show().focus();

		});


		// Listening for keyboard input on the search field.
		// We are using the "input" event which detects cut and paste
		// in addition to keyboard input.

		filemanager.find('input').on('input', function(e){

			folders = [];
			files = [];

			var value = this.value.trim();

			if(value.length) {

				filemanager.addClass('searching');

				// Update the hash on every key stroke
				window.location.hash = 'search=' + value.trim();

			}

			else {

				filemanager.removeClass('searching');
				window.location.hash = encodeURIComponent(currentPath);

			}

		}).on('keyup', function(e){

			// Clicking 'ESC' button triggers focusout and cancels the search

			var search = $(this);

			if(e.keyCode == 27) {

				search.trigger('focusout');

			}

		}).focusout(function(e){

			// Cancel the search

			var search = $(this);

			if(!search.val().trim().length) {

				window.location.hash = encodeURIComponent(currentPath);
				search.hide();
				search.parent().find('span').show();

			}

		});


		// Clicking on folders

		fileList.on('click', 'li.folders', function(e){
			e.preventDefault();

			var nextDir = $(this).find('a.folders').attr('href');

			if(filemanager.hasClass('searching')) {

				// Building the breadcrumbs

				breadcrumbsUrls = generateBreadcrumbs(nextDir);

				filemanager.removeClass('searching');
				filemanager.find('input[type=search]').val('').hide();
				filemanager.find('span').show();
			}
			else {
				breadcrumbsUrls.push(nextDir);
			}

			window.location.hash = encodeURIComponent(nextDir);
			currentPath = nextDir;
		});


		// Clicking on breadcrumbs

		breadcrumbs.on('click', 'a', function(e){
			e.preventDefault();

			var index = breadcrumbs.find('a').index($(this)),
				nextDir = breadcrumbsUrls[index];
		  breadcrumbsUrls.length = Number(index)+1;

			window.location.hash = encodeURIComponent(nextDir);

		});


		// Navigates to the given hash (path)

		function goto(hash) {

			hash = decodeURIComponent(hash).slice(1).split('=');

			if (hash.length) {
				var rendered = '';

				// if hash has search in it

				if (hash[0] === 'search') {

					filemanager.addClass('searching');
					rendered = searchData(response, hash[1].toLowerCase());

					if (rendered.length) {
						currentPath = hash[0];
						render(rendered);
					}
					else {
						render(rendered);
					}

				}

				// if hash is some path

				else if (hash[0].trim().length) {

					rendered = searchByPath(hash[0]);

					if (rendered.length) {

						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);

					}
					else {
						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);
					}

				}

				// if there is no hash

				else {
					currentPath = data.path;
					breadcrumbsUrls.push(data.path);
					render(searchByPath(data.path));
				}
			}
		}

		// Splits a file path and turns it into clickable breadcrumbs

		function generateBreadcrumbs(nextDir){
			var path = nextDir.split('/').slice(0);
			for(var i=1;i<path.length;i++){
				path[i] = path[i-1]+ '/' +path[i];
			}
			return path;
		}


		// Locates a file by path

		function searchByPath(dir) {
			var path = dir.split('/'),
				demo = response,
				flag = 0;

			for(var i=0;i<path.length;i++){
				for(var j=0;j<demo.length;j++){
					if(demo[j].name === path[i]){
						flag = 1;
						demo = demo[j].items;
						break;
					}
				}
			}

			demo = flag ? demo : [];
			return demo;
		}


		// Recursively search through the file tree

		function searchData(data, searchTerms) {

			data.forEach(function(d){
				if(d.type === 'folder') {

					searchData(d.items,searchTerms);

					if(d.name.toLowerCase().match(searchTerms)) {
						folders.push(d);
					}
				}
				else if(d.type === 'file') {
					if(d.name.toLowerCase().match(searchTerms)) {
						files.push(d);
					}
				}
			});
			return {folders: folders, files: files};
		}


		// Render the HTML for the file manager

		function render(data) {

			var scannedFolders = [],
				scannedFiles = [];

			if(Array.isArray(data)) {

				data.forEach(function (d) {

					if (d.type === 'folder') {
						scannedFolders.push(d);
					}
					else if (d.type === 'file') {
						scannedFiles.push(d);
					}

				});

			}
			else if(typeof data === 'object') {

				scannedFolders = data.folders;
				scannedFiles = data.files;

			}


			// Empty the old result and make the new one

			fileList.empty().hide();

			if(!scannedFolders.length && !scannedFiles.length) {
				filemanager.find('.nothingfound').show();
			}
			else {
				filemanager.find('.nothingfound').hide();
			}

			if(scannedFolders.length) {

				scannedFolders.forEach(function(f) {

					var itemsLength = f.items.length,
						name = escapeHTML(f.name),
						icon = '<span class="icon folder"></span>';

					if(itemsLength) {
						icon = '<span class="icon folder full"></span>';
					}

					if(itemsLength == 1) {
						itemsLength += ' item';
					}
					else if(itemsLength > 1) {
						itemsLength += ' items';
					}
					else {
						itemsLength = 'Empty';
					}

					var folder = $('<li class="folders card"><a href="'+ f.path +'" title="'+ f.path +'" class="folders">'+icon+'<span class="name">' + name + '</span> <span class="details">' + itemsLength + '</span></a></li>');
					folder.appendTo(fileList);
				});

			}

			if(scannedFiles.length) {

				scannedFiles.forEach(function(f, index) {
					var indexRand = index + Math.random().toString().replace('.', '');
					var fileSize = bytesToSize(f.size),
						name = escapeHTML(f.name),
						fileType = name.split('.'),
						icon = '<span class="icon file"></span>';

					fileType = fileType.length > 1 ? fileType[fileType.length-1] : '';

					icon = '<span class="icon file f-' + fileType + '">' + fileType + '</span>';

					var file = $(
						'<li class="files card">'+
						'<div title="'+ f.path +'" class="files">'+icon+
						'<span class="name">'+ name +'</span> <span class="details">'+
						fileSize+'</span></div>' +
						'</li>'
					);
					var modal;

					var extension = f.path.toLowerCase().split(".");
					extension = extension[extension.length-1];
					if (["png", "jpg", "jpeg"].indexOf(extension) > -1) {
						modal = $(
							'<div id="modal'+indexRand+'" class="modal">' +
							'<div class="modal-content" '+
									 'style="background-image: url(\''+f.path+'\'); '+
									 'background-repeat: no-repeat; overflow: hidden; '+
									 'margin: 5vh; min-height: 50vh; background-size: contain; '+
									 'background-position: center;">' +
					    '</div>'+
	    				'<div class="modal-footer">'+
	      				'<div class=" modal-action modal-close waves-effect waves-red btn-flat">Close</div>'+
	      				'<a href="' + f.path + '" class=" modal-action modal-close waves-effect waves-green btn-flat">Download</a>'+
						  '</div>'+
						  '</div>'
						);
					} else if (["wmv", "mkv", "mp4", "webm", "ogv", "aac", "mp3", "ogg", "wav"].indexOf(extension) > -1) {
						modal = $(
							'<div id="modal'+indexRand+'" class="modal">' +
							'<div class="modal-content" '+
									 'style="background-repeat: no-repeat; overflow: hidden; '+
									 'margin: 5vh; min-height: 50vh; background-size: contain; '+
									 'background-position: center; text-align: center;">' +
								'<video id="vbox'+indexRand+'" class="video-js vjs-fluid vjs-default-skin" controls preload="auto" data-setup=\'{}\'>' +
								  '<source src="'+f.path+'" type="video/webm">' +
								'</video>' +
					    '</div>'+
	    				'<div class="modal-footer">'+
	      				'<div class=" modal-action modal-close waves-effect waves-red btn-flat">Close</div>'+
	      				'<a href="' + f.path + '" class=" modal-action modal-close waves-effect waves-green btn-flat">Download</a>'+
						  '</div>'+
						  '</div>'
						);
					} else if (["txt", "java", "c", "cpp", "h", "py", "js", "html", "css", "xml", "json", "md", "log"].indexOf(extension) > -1) {
						modal = $(
							'<div id="modal'+indexRand+'" class="modal">' +
							'<div class="modal-content" '+
									 'style="background-image: url(\''+f.path+'\'); '+
									 'background-repeat: no-repeat; overflow: hidden; '+
									 'margin: 5vh; min-height: 50vh; background-size: contain; '+
									 'background-position: center;"><div id="codebox'+indexRand+'" style="font-family: monospace; white-space: pre-wrap;"></div>' +
					    '</div>'+
	    				'<div class="modal-footer">'+
	      				'<div class=" modal-action modal-close waves-effect waves-red btn-flat">Close</div>'+
	      				'<a href="' + f.path + '" class=" modal-action modal-close waves-effect waves-green btn-flat">Download</a>'+
						  '</div>'+
						  '</div>'
						);
					} else {
						modal = $(
							'<div id="modal'+indexRand+'" class="modal">' +
							'<div class="modal-content" style="overflow: hidden; margin: 5vh; min-height: 50vh; text-align: center;">'+
								'<iframe width="480" height="360" src="https://www.kickstarter.com/projects/cyanideandhappiness/joking-hazard/widget/video.html" frameborder="0" scrolling="no"> </iframe>' +
					    '</div>'+
	    				'<div class="modal-footer">'+
	      				'<div class=" modal-action modal-close waves-effect waves-red btn-flat">Close</div>'+
	      				'<a href="' + f.path + '" class=" modal-action modal-close waves-effect waves-green btn-flat">Download</a>'+
						  '</div>'+
						  '</div>'
						);
					}

					// add file tile
					file.appendTo(fileList);

					// add modal
					modal.appendTo($('body'));

					// init player
          if (["wmv", "mkv", "mp4", "webm", "ogv", "aac", "mp3", "ogg", "wav"].indexOf(extension) > -1) {
		        videojs('vbox'+indexRand, {}, function(){

		        });
					}

					// add preview trigger
					file.on("click", function() {
						// enable syntax highlight if plain text
						if (["txt", "java", "c", "cpp", "h", "py", "js", "html", "css", "xml", "json", "md", "log"].indexOf(extension) !== -1) {
							$.get(f.path, function(data) {
							  $('#codebox'+indexRand).text(data);
								$('#codebox'+indexRand).each(function(i, block) {
								  hljs.highlightBlock(block);
								});
							}, 'text');
						}

						// show modal for all
						$('#modal'+ indexRand).openModal();
					});

				});

			}


			// Generate the breadcrumbs

			var url = '';

			if(filemanager.hasClass('searching')){

				url = '<span>Search results: </span>';
				fileList.removeClass('animated');

			}
			else {
				// Rewrite using materialcss

				fileList.addClass('animated');

				var name = breadcrumbsUrls[breadcrumbsUrls.length-1].split('/');
				name.forEach(function(u, i) {
					if (i === 0) {
						// root
						url += '<a href="'+breadcrumbsUrls[i]+'" class="breadcrumb"><i class="material-icons">home</i></a>';
					} else if (i !== name.length-1) {
						// mid
						url += '<a href="'+breadcrumbsUrls[i]+'" class="breadcrumb">' + name[i] + '</a>';
					} else {
						// current
						url += '<span class="breadcrumb">' + name[i] + '</span>';
					}
				});
			}

			breadcrumbs.text('').append(url);


			// Show the generated elements

			fileList.animate({'display':'inline-block'});

		}


		// This function escapes special html characters in names

		function escapeHTML(text) {
			return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
		}


		// Convert file sizes from bytes to human readable units

		function bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}

	});
});
