export default function Myset() {
  this.collection = [];
  this.bestNode = null;
  this.add = (Node) => {
    const haveItem =
      this.collection.filter((item) => item.node?.id == Node.id).length > 0;
    if (!haveItem) {
      this.collection.push(Node);
    } else {
      this.collection = this.collection.filter(
        (item) => item.node?.id !== Node.id
      );
    }
  };
  this.delete = (Node) => {
    this.collection = this.collection.filter(
      (collectionItem) => collectionItem?.node?.id !== Node.node.id
    );
    return this.collection;
  };

  this.findBestNode = () => {
    this.bestNode = this.collection.reduce((all, current) => {
      return all.cost > current.cost ? current : all;
    });
    return this.bestNode;
  };
  this.reSort = () => {
    return this.collection.sort((a, b) => a.cost - b.cost);
  };
  this.show = () => {
    console.log(this.collection);
  };
  this.col = () => {
    return this.collection;
  };
}