# mongoose-aggregate-paginate

> `mongoose-aggregate-paginate` is a [Mongoose][mongoose] plugin easy to add pegination for aggregates.  This plugin is to be used in combination with view pagination middleware such as [express-paginate](https://github.com/niftylettuce/express-paginate).   

[![Build Status][travis-ci-img]][travis-ci-url] 
[![npm version][npm-version-img]][npm-version-url] 
[![Dependency Status][dependancy-status-img]][dependancy-status-url]

## Index
* [Install](#install)
* [Usage](#usage)
* [License](#license)

## Install

```bash
npm install mongoose-aggregate-paginate --save
```
## Usage

This plugin must first be added to a schema:

```js

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

mySchema.plugin(mongooseAggregatePaginate);

```

`MyModel` will have a new function called `paginate` (e.g. `MyModel.aggregatePaginate()`).

### MyModel.aggregatePaginate(aggregate, options, callback)

**Arguments**

* `aggregate` - An object of the [Mongoose][mongoose] aggregate.
* `options` - An object with options for the [Mongoose][mongoose] query, such as sorting
  - `page` - Default: `1`
  - `limit` - Default: `10`
  - `sortBy` - Default: `null`
* `callback(err, results, pageCount, itemCount)` - A callback is called once pagination results are retrieved, or an error has occurred.

**Examples**

```js

var MyModel = mongoose.model('MyModel',{
  name : String,
  age: Number,
  city, String
});

// find users above 18 by city
var aggregate = MyModel.aggregate();
aggregate.match({age : {'lt' : 18 } })
.group({ _id: '$city' , count : { '$sum' : 1 } })
var options = { page : 1, limit : 15};

MyModel.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
  if(err) 
    console.err(err);
  else 
    console.log(results);
});

```
## Tests

```js
npm test
```
## Acknowlegements
mongoose-aggregate-paginate was inspired by [mongoose-paginate][mongoose-paginate].

## License
[MIT][license-url]

[mongoose]: http://mongoosejs.com
[mongoose-paginate]: https://www.npmjs.com/package/mongoose-paginate
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[travis-ci-img]: https://travis-ci.org/Maheshkumar-Kakade/mongoose-aggregate-paginate.svg?branch=master
[travis-ci-url]: https://travis-ci.org/Maheshkumar-Kakade/mongoose-aggregate-paginate 
[npm-version-img]: https://badge.fury.io/js/mongoose-aggregate-paginate.svg
[npm-version-url]: http://badge.fury.io/js/mongoose-aggregate-paginate
[dependancy-status-img]: https://gemnasium.com/Maheshkumar-Kakade/mongoose-aggregate-paginate.svg
[dependancy-status-url]: https://gemnasium.com/Maheshkumar-Kakade/mongoose-aggregate-paginate