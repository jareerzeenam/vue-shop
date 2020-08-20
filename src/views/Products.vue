<template>
  <div class="products">
    <div class="containe">
      <div class="intro h-100">
        <div class="row h-100 justify-content-center align-items-center">
          <div class="col-md-6">
            <h3>Products Page Main</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus,
              libero?
            </p>
          </div>
          <div class="col-md-6">
            <img src="/img/svg/products.svg" alt class="img-fluid" />
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="product">
      <h3 class="d-inline-block">Products List</h3>
      <button @click="addNew" class="btn btn-primary float-right">Add Product</button>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Tag</th>
              <th>Product Images</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products">
              <td>{{ product.name }}</td>
              <td>{{ product.price }}</td>
              <td  v-html="product.description"></td>
              <td>{{ product.tags }}</td>
             

              <td>
                 <span class="p-1" v-for="image in product.images">
                      <img :src="image" alt width="30px" />
                  </span>
              </td>
              <td>
                <button class="btn btn-primary" @click="editProduct(product)">Edit</button>
                &nbsp;
                <button
                  class="btn btn-danger"
                  @click="deleteProduct(product)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="product"
      tabindex="-1"
      role="dialog"
      aria-labelledby="editLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editLabel">Edit Product</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <!-- main product -->
              <div class="col-md-8">
                <div class="form-group">
                  <input
                    type="text"
                    placeholder="Product Name"
                    class="form-control"
                    v-model="product.name"
                  />
                </div>

                <div class="form-group">
                  <vue-editor v-model="product.description"></vue-editor>
                </div>
              </div>
              <!-- product sidebar -->
              <div class="col-md-4">
                <h4 class="display-8">Product Details</h4>
                <hr />

                <div class="form-group">
                  <input
                    type="text"
                    v-model="product.price"
                    placeholder="Product price"
                    class="form-control"
                  />
                </div>

                <div class="form-group">
                  <input
                    type="text"
                    v-model="tag"
                    placeholder="Product tags"
                    class="form-control"
                    @keyup.188="addTag"
                  />

                  <div class="d-flex">
                    <p v-for="tag in product.tags">
                      <span class="p-1 text-secondary">{{ tag }}</span>
                    </p>
                  </div>
                </div>

                <div class="form-group">
                  <label for="product_image">Product Images</label>
                  <input type="file" @change="uploadImage" class="form-control" />
                </div>
                <div class="form-group d-flex">
                  <div class="p-1" v-for="(image,index) in product.images">
                    <div class="img-wrapp">
                      <img :src="image" alt width="80px" />
                      <span class="delete-img" @click="deleteImage(image,index)">X</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button
              @click="addProduct()"
              type="button"
              class="btn btn-primary"
              v-if="modal == 'new'"
            >Save Product</button>
            <button
              @click="updateProduct()"
              type="button"
              class="btn btn-primary"
              v-if="modal == 'edit'"
            >Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Basic Use - Covers most scenarios
import { VueEditor } from "vue2-editor";

import { fb, db } from "../firebase";

export default {
  name: "Products",
  components: {
    VueEditor
  },
  props: {
    msg: String
  },
  data() {
    return {
      
      products: [],
      product: {
        name: null,
        description: null,
        price: null,
        tags: [],
        images: []
      },
      // ! below line gets the id of each product
      activeItem: null,
      // ! Edit mode
      modal: null,
      tag: null
    };
  },
  firestore() {
    return {
      products: db.collection("products")
    };
  },
  methods: {
    // ! Delete image
    deleteImage(img, index) {
      let image = fb.storage().refFromURL(img);

      this.product.images.splice(index, 1);
      image
        .delete()
        .then(function() {
          console.log("image deleted");
        })
        .catch(function(error) {
          console.log("an error occured");
        });
    },
    // !!Add tag
    addTag() {
      this.product.tags.push(this.tag);
      this.tag = "";
    },

    reset() {
      this.product = {
        name: null,
        description: null,
        price: null,
        tags: [],
        images: []
      };
    },

    // ! Add new
    addNew() {
      this.modal = "new";
      this.reset();
      $("#product").modal("show");
    },

    // ! Upload Image
    uploadImage(e) {
      if (e.target.files[0]) {
        let file = e.target.files[0];

        // Create a root reference
        var storageRef = fb.storage().ref("products/" + file.name);

        let uploadTask = storageRef.put(file);

        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              // !store the image
              this.product.images.push(downloadURL);
              console.log("File available at", downloadURL);
            });
          }
        );
      }
    },

    // !Update product
    updateProduct() {
      this.$firestore.products.doc(this.product.id).update(this.product);
      $("#product").modal("hide");
      Toast.fire({
        icon: "success",
        title: "Updated added successfully"
      });
    },

    // ! Edit
    editProduct(product) {
      this.modal = "edit";
      this.product = product;
      $("#product").modal("show");
    },

    // !Delete
    deleteProduct(doc) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          // ! below line will output the id of the selected peoduct
          // console.log(doc[".key"]);
          // this.$firestore.products.doc(doc["id"]).delete();
          this.$firestore.products.doc(doc.id).delete();
          Toast.fire({
            icon: "success",
            title: "Deleted successfully"
          });
        }
      });
    },
    // !read data
    redaData() {},

    // ! Save data to the fb DB
    addProduct() {
      this.$firestore.products.add(this.product);
      $("#product").modal("hide");
      Toast.fire({
        icon: "success",
        title: "Product added successfully"
      });
    }
  },
  created() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.img-wrapp {
  position: relative;
}
.delete-img {
  transition: all 0.2s;
  padding: 10px;
  border-radius: 55px;
  color: transparent;
  margin-left: -50px;
  margin-top: 20px;
  position: absolute;
  z-index: 9;
}
.img-wrapp span .delete-img {
  position: absolute;
  cursor: pointer;
  top: -14px;
  left: -2px;
}
.img-wrapp .delete-img:hover {
  cursor: pointer;
  background: rgba(255, 0, 0, 0.432);
  color: white;
}
</style>
