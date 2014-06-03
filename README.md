# RoadApps Checklist Scheme

```bash
  $ npm install roadapps.mod-checklist
```

## Usage

```js
  var mongoose = require('mongoose');
  var Schemas = require('roadapps.checklist')(mongoose);
  var Checklist = Schemas.Checklist;

  mongoose.connect('mongodb://localhost/heisenberg');

  Checklist.find().exec(function(err, checklists) {
      console.dir(checklists);
  });

  var q = new Schemas.Question();
  q.text = 'hail';
  q.save(console.log);
```

## Schemas

* Checklist
* Form
* Question
* Vehicle
