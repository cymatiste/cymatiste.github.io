
// The Disjoint-set data structure
function DisjointSet(count) {

    this.Count = count;
   
    this.getCount = function(){
        return this.Count;
    };
    this.setCount = function(val){
        this.Count = val;
    };

    // The parent of each element in the collection.
	this.Parent = [];

	// The rank of the tree to which each element belongs
	this.Rank = [];
	
    // Initializes a new Disjoint-Set data structure, with the specified amount of elements in the collection.
    // Initially, all elements are in their own set.
	for (var i = 0; i < this.Count; i++) {
		this.Parent[i] = i;
		this.Rank[i] = 0;
	}

	// Finds the representative of the set that i is an element of
	this.Find = function(i) {			
		// If i is the parent of itself
		if (this.Parent[i] == i) {

			// Then i is the representative of his set
			return i;
		}
		else { // Else if i is not the parent of itself

			// Then i is not the representative of his set,
			// so we recursively call Find on it's parent, and save it in our result variable
			var result = this.Find(this.Parent[i]);

			// We then cache the result by moving i's node directly under the representative of his set
			this.Parent[i] = result;

			// And then we return the result
			return result;
		}
	}

	// Unites the set that includes i and the set that includes j
	this.Union = function(i,j) {
		// Find the representatives (or the root nodes) for the set that includes i
		var irep = this.Find(i),
			// And do the same for the set that includes j
			jrep = this.Find(j),
			// Get the rank of i's tree
			irank = this.Rank[irep],
			// Get the rank of j's tree
			jrank = this.Rank[jrep];

		// Elements are in the same set, no need to unite anything.
		if (irep == jrep)
			return;

		// If i's rank is less than j's rank
		if (irank < jrank) {

			// Then move i under j
			this.Parent[irep] = jrep;

		} // Else if j's rank is less than i's rank
		else if (jrank < irank) {

			// Then move j under i
			this.Parent[jrep] = irep;

		} // Else if their ranks are the same
		else {

			// Then move i under j (doesn't matter which one goes where)
			this.Parent[irep] = jrep;

			// And increment the the result tree's rank by 1
			this.Rank[jrep]++;
		}
	}
}