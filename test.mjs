import test from 'node:test';import assert from 'node:assert/strict';import {run,evaluate} from './index.mjs';import {sample,policy} from '../oracledrill-fixtures/index.mjs';
for(const s of sample.scenarios)test(s.id,()=>assert.equal(evaluate(s.report,policy,s.reference,s.now).code,s.expectedCode));
test('all fixture expectations pass',()=>assert.equal(run(sample).summary.expectationFailures,0));
test('unsafe accepts stale report',()=>assert.equal(run(sample).rows.find(x=>x.id==='stale').unsafeAcceptsRejected,true));
test('duplicate ids rejected',()=>assert.throws(()=>run({...sample,scenarios:[sample.scenarios[0],sample.scenarios[0]]})));
test('required reference enforced',()=>assert.equal(evaluate(sample.scenarios[0].report,{...policy,require_reference:true},null,'1800000000').code,'MISSING_REFERENCE'));
test('checked i128 arithmetic',()=>assert.equal(evaluate({...sample.scenarios[0].report,answer:((1n<<127n)-1n).toString()},policy,sample.scenarios[0].report,'1800000000').code,'ARITHMETIC'));
test('invalid policy rejected',()=>assert.throws(()=>run({...sample,policy:{...policy,max_age:0}})));
test('over-limit corpus rejected',()=>assert.throws(()=>run({...sample,scenarios:Array(101).fill(sample.scenarios[0])})));

test('malformed scalar reference is not treated as absent',()=>assert.equal(evaluate(sample.scenarios[0].report,policy,false,'1800000000').code,'MALFORMED'));
