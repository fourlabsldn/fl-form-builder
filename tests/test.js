
module.exports = function () {
  function Aconst() {
    this.test = ['a', 'b'];
  }

  Aconst.prototype.list = function list() {
    this.test.forEach(function (each) {
      console.log(each);
    });
  };

  function AChild() {
    Aconst.apply(this);
    this.name = 'achild';
  }

  AChild.prototype.testIt = function () {
    console.log('The name is ', this.name);
  };

  return {
    Aconst: Aconst,
    AChild: AChild,
  };
};
