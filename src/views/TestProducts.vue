<template>
  <div class="products">
    <div class="containe">
      <div class="intro h-100">
        <div class="row h-100 justify-content-center align-items-center">
          <div class="col-md-6">
            <h3>Test Products Page</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, libero?</p>
          </div>
          <div class="col-md-6">
            <img src="/img/svg/products.svg" alt class="img-fluid" />
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="product-test">
      <h3 class="d-inline-block">Basic Crud in firebase</h3>

      <div class="form-group">
        <input type="text" class="form-control" v-model="product.name" placeholder="Product Name" />
      </div>

      <div class="form-group">
        <input
          type="text"
          @keyup.enter="saveData"
          class="form-control"
          v-model="product.price"
          placeholder="Price"
        />
      </div>

      <div class="form-group">
        <button @click="saveData" type="submit" class="btn btn-primary">Save Data</button>
      </div>

      <hr />
      <h3>Products List</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products">
              <td>{{product.data().name}}</td>
              <td>{{product.data().price}}</td>
              <td>
                <button @click="editProduct(product)" class="btn btn-primary">Edit</button>
                <button @click="deleteProduct(product.id)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="edit" tabindex="-1" aria-labelledby="editLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editLabel">Edit Product</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="product.name"
                placeholder="Product Name"
              />
            </div>

            <div class="form-group">
              <input
                type="text"
                @keyup.enter="saveData"
                class="form-control"
                v-model="product.price"
                placeholder="Price"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button @click="updateProduct()" type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fb, db } from "../firebase";

export default {
  name: "TestProducts",
  props: {
    msg: String
  },
  data() {
    return {
      products: [],
      product: {
        name: null,
        price: null
      },
      // ! below line gets the id of each product
      activeItem: null
    };
  },
  methods: {
    // !Watch for updates
    watcher() {
      db.collection("products").onSnapshot(querySnapshot => {
        this.products = [];
        querySnapshot.forEach((doc)=> {
          this.products.push(doc);
        });
      });
    },

    // ! Update
    updateProduct() {
      db.collection("products")
        .doc(this.activeItem)
        .update(this.product)
        .then(()=> {
          $("#edit").modal("hide");
          this.watcher();
          console.log("Document successfully updated!");
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    // ! Edit
    editProduct(product) {
      $("#edit").modal("show");
      this.product = product.data();
      this.activeItem = product.id;
    },
    // !Delete
    deleteProduct(doc) {
      if (confirm("Are you sure ?")) {
        db.collection("products")
          .doc(doc)
          .delete()
          .then(()=> {
             this.watcher();
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
      } else {
      }
    },
    redaData() {
      db.collection("products")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            // !  this.products = querySnapshot;
            this.products.push(doc);
          });
        });
    },
    saveData() {
      db.collection("products")
        .add(this.product)
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
          this.redaData();
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    },
    reset() {
      // Object.assign(this.$data, this.$options.data.apply(this));
    }
  },
  created() {
    this.redaData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
