"use strict";
// Transcrypt'ed from Python, 2016-01-06 14:33:46
function test () {
	var __all__ = {};
	var __world__ = __all__;
	
	var __envir__ = 'transcrypt';
	__all__.__envir__ = __envir__;
	
	// Nested object creator, part of the nesting may already exist and have attributes
	var __nest__ = function (headObject, tailNames, value) {
		// In some cases this will be a global object, e.g. 'window'
		var current = headObject;
		
		if (tailNames != '') {	// Split on empty string doesn't give empty list
			// Find the last already created object in tailNames
			var tailChain = tailNames.split ('.');
			var firstNewIndex = tailChain.length;
			for (var index = 0; index < tailChain.length; index++) {
				if (!current.hasOwnProperty (tailChain [index])) {
					firstNewIndex = index;
					break;
				}
				current = current [tailChain [index]];
			}
			
			// Create the rest of the objects, if any
			for (var index = firstNewIndex; index < tailChain.length; index++) {
				current [tailChain [index]] = {};
				current = current [tailChain [index]];
			}
		}
		
		// Insert it new attributes, it may have been created earlier and have other attributes
		for (var attrib in value) {
			current [attrib] = value [attrib];			
		}		
	};
	__all__.__nest__ = __nest__;
	
	// Initialize module if not yet done and return its globals
	var __init__ = function (module) {
		if (!module.__inited__) {
			module.__all__.__init__ (module.__all__);
		}
		return module.__all__;
	};
	__all__.__init__ = __init__;
	
	// Factory f that creates and invokes a factory g for one of three curried functions for func
	// Which caller is produced by the factory g depends on what's to the left of the dot
	// Since we want to assign functions, a = b.g should make b.g produce a function
	// So g should be a property rather then a function
	var __get__ = function (self, func) {
		// Curried function factory g
		return function () {
			var args = [] .slice.apply (arguments);
			if (self) {
				if (self.hasOwnProperty ('__class__')) {			// Object before the dot
					return function (args) {						// Return bound function
						func.apply (null, [self] .concat (args));
					}
				}
				else {												// Class before the dot
					return func;									// Return static method
				}
			}
			else {													// Nothing before the dot
				return func;										// Return free function
			}
		} ();
	}
	__all__.__get__ = __get__;
			
	// Class creator function
	var __class__ = function (name, bases, extra) {
		// Create class functor
		var cls = function () {
			var args = [] .slice.apply (arguments);
			return cls.__new__ (args);
		};
		
		// Copy methods and static attributes to class object
		for (var index in bases) {
			var base = bases [index];
			for (attrib in base) {
				cls [attrib] = base [attrib];
			}
		}
		
		// Add class specific attributes to class object
		cls.__name__ = name;
		cls.__bases__ = bases;
		
		// Add own methods and static attributes to class object
		for (var attrib in extra) {
			var descrip = Object.getOwnPropertyDescriptor (extra, attrib);
			Object.defineProperty (cls, attrib, descrip);
		}
				
		// Return class object
		return cls;
	};
	__all__.__class__ = __class__;

	// Create mother of all classes		
	var object = __all__.__class__ ('object', [], {
		__init__: function (self) {},
			
		// Object creator function is inherited by all classes
		__new__: function (args) {	// Args are just the constructor args		
			// Create instance, by 'inheriting' from this (the class), never more than 1 deep
			// In this way methods will be available both with a class and an object before the dot
			// The descriptor produced by __get__ will return the right method flavor
			var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
			
			// Call constructor
			this.__init__.apply (null, [instance] .concat (args));
			
			// Return instance			
			return instance;
		}	
	});
	__all__.object = object;
	// Console message
	var print = function () {
		console.log ([] .slice.apply (arguments) .join (' '));
	};
	__all__.print = print;
	
	// Make console.log understand apply
	console.log.apply = function () {
		print ([] .slice.apply (arguments) .slice (1));
	};

	// Len method for collections
	var len = function (collection) {
		if (collection.hasOwnProperty ('length')) {
			return collection.length;
		}
		else {
			return collection.size;
		}
	};
	__all__.len = len;
	
	// Zip method for arrays
	var zip = function () {
		var args = [].slice.call (arguments);
		var shortest = args.length == 0 ? [] : args.reduce (	// Find shortest array in arguments
			function (array0, array1) {
				return array0.length < array1.length ? array0 : array1;
			}
		);
		return shortest.map (					// Map each element of shortest array
			function (current, index) {			// To the result of this function
				return args.map (				// Map each array in arguments
					function (current) {		// To the result of this function
						return current [index]; // Namely it's index't entry
					}
				);
			}
		);
	}
	__all__.zip = zip;
	
	// Range method, returning an array
	function range (start, stop, step) {
		if (typeof stop == 'undefined') {
			// one param defined
			stop = start;
			start = 0;
		}
		if (typeof step == 'undefined') {
			step = 1;
		}
		if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
			return [];
		}
		var result = [];
		for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
			result.push(i);
		}
		return result;
	};
	
	// Enumerate method, returning a zipped list
	
	function enumerate (aList) {
		return zip (range (len (aList)), aList);
	}
	
	// --- Set methods
	
	var set = function (iterable) {
		return new Set (iterable);
	};
	__all__.set = set;
	
	// --- List methods
	
	var list = function  () {
		return [] .slice.apply (arguments);
	}
	__all__.list = list;
	
	Array.prototype.append = function (element) {
		this.push (element);
	};

	Array.prototype.extend = function (aList) {
		this.push.apply (this, aList);
	};
	
	Array.prototype.clear = function (aList) {
		aList.splice (0, aList.length);
	};
	
	// --- String methods
	
	String.prototype.join = function (aList) {
		return aList.join (this);
	};
	
	String.prototype.rsplit = function (sep, maxsplit) {
		var split = this.split (sep || /s+/);
		return maxsplit ? [ split.slice (0, -maxsplit) .join (sep) ].concat (split.slice (-maxsplit)) : split;
	};
	
	String.prototype.strip = function () {
		return this.replace (/^\s*|\s*$/g, '');
	};
		
	String.prototype.lstrip = function () {
		return this.replace (/^\s*/g, '');
	};
	
	String.prototype.rstrip = function () {
		return this.replace (/\s*$/g, '');
	};
	(function () {
		var p = 1;
		;
		var p = 2;
		;
		var x = [888, 1];
		;
		var Y = __class__ ('Y', [object], {
			get __init__ () {return __get__ (this, function (self) {
				self.z = 3;
				;
			});}
		});
		var y12 = Y ();
		;
		var __tmp__ = [[77, 22, [1, 2, 3]], [33, 44]];
		x [1]  = __tmp__ [0][0];
		var b = __tmp__ [0][1];
		y12.z = __tmp__ [0][2];
		var c = __tmp__ [1][0];
		var d = __tmp__ [1][1];
		;
		print (x, b, y12.z, c, d);
		var __tmp__ = [1, 2];
		var a = __tmp__ [0];
		var b = __tmp__ [1];
		;
		print (a, b);
		var __tmp__ = [[[1, 2], [3, 4]], [5, 6]];
		var p = __tmp__ [0][0][0];
		var q = __tmp__ [0][0][1];
		var r = __tmp__ [0][1][0];
		var s = __tmp__ [0][1][1];
		var t = __tmp__ [1][0];
		var u = __tmp__ [1][1];
		;
		print (p, q, r, s, t, u);
		//<all>
		__all__.Y = Y;
		__all__.a = a;
		__all__.b = b;
		__all__.c = c;
		__all__.d = d;
		__all__.p = p;
		__all__.q = q;
		__all__.r = r;
		__all__.s = s;
		__all__.t = t;
		__all__.u = u;
		__all__.x = x;
		__all__.y12 = y12;
		//</all>
	}) ();
	return __all__;
}
