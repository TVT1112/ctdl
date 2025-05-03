class TreeNode234 {
  constructor() {
    this.keys = [];
    this.children = [];
  }

  isLeaf() {
    return this.children.length === 0;
  }
}

class Tree234 {
  constructor() {
    this.root = new TreeNode234();
    this.steps = [];
  }

  search(name) {
    return this._search(this.root, name);
  }

  _search(node, name) {
    if (!node) return null;

    for (let i = 0; i < node.keys.length; i++) {
      if (name === node.keys[i].name) {
        return node.keys[i];
      } else if (name < node.keys[i].name) {
        return this._search(node.children[i], name);
      }
    }

    return this._search(node.children[node.keys.length], name);
  }

  
  insert(name, phone) {
    const newKey = { name, phone };
    let root = this.root;

    if (root.keys.length === 3) {
      const newRoot = new TreeNode234();
      newRoot.children.push(root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this.insertNonFull(this.root, newKey);

    // Lưu trạng thái sau mỗi lần thêm
    this.steps.push(this.cloneTree(this.root));
  }

  insertNonFull(node, key) {
    if (node.isLeaf()) {
      node.keys.push(key);
      node.keys.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      let i = node.keys.length - 1;
      while (i >= 0 && key.name < node.keys[i].name) {
        i--;
      }
      i++;

      if (node.children[i] && node.children[i].keys.length === 3) {
        this.splitChild(node, i);
        if (key.name > node.keys[i].name) {
          i++;
        }
      }
      this.insertNonFull(node.children[i], key);
    }
  }

  splitChild(parent, index) {
    const child = parent.children[index];
    const newNode = new TreeNode234();

    // Đưa phần tử giữa lên parent
    parent.keys.splice(index, 0, child.keys[1]);

    // Chia child thành hai phần
    newNode.keys.push(child.keys[2]);
    child.keys.splice(1, 2);

    if (!child.isLeaf()) {
      newNode.children = child.children.splice(2);
    }

    parent.children.splice(index + 1, 0, newNode);
  }

  inorder(node = this.root, result = []) {
    if (!node) return result;
    for (let i = 0; i < node.keys.length; i++) {
      if (node.children[i]) {
        this.inorder(node.children[i], result);
      }
       result.push(node.keys[i]);
    }
    if (node.children[node.keys.length]) {
      this.inorder(node.children[node.keys.length], result);
    }
    return result;
  }

  delete(name) {
    this._delete(this.root, name);
  
    // Sau khi xóa, nếu root không có key và có child thì set lại root
    if (this.root.keys.length === 0 && this.root.children.length > 0) {
      this.root = this.root.children[0];
    }
  
    // Lưu bước sau khi xóa
    this.steps.push(this.cloneTree(this.root));
  }

  _delete(node, name) {
    if (!node) return;
  
    const idx = node.keys.findIndex(k => k.name === name);
  
    if (idx !== -1) {
      // 1. Key nằm trong node hiện tại
      if (node.isLeaf()) {
        // 1.1 Node là lá => xóa trực tiếp
        node.keys.splice(idx, 1);
      } else {
        // 1.2 Node có con => thay bằng successor
        let successor = this._getSuccessor(node.children[idx + 1]);
        node.keys[idx] = successor;
        this._delete(node.children[idx + 1], successor.name);
      }
    } else {
      // 2. Key không nằm trong node hiện tại => đệ quy xuống
      let i = 0;
      while (i < node.keys.length && name > node.keys[i].name) i++;
  
      if (node.children[i]) {
        this._delete(node.children[i], name);
      }
    }
  }
  
  _getSuccessor(node) {
    // Đi tới con trái nhất
    while (!node.isLeaf()) {
      node = node.children[0];
    }
    return node.keys[0];
  }
  

  getSteps() {
    return this.steps;
  }

  cloneTree(node) {
    if (!node) return null;
    return {
      keys: node.keys.map(k => ({ name: k.name, phone: k.phone })),
      children: node.children.map(child => this.cloneTree(child)),
    };
  }
}

class ContactArray {
  constructor(contacts) {
    this.contacts = contacts || [];
  }

  addContact(name, phone) {
    if (this.contacts.find(c => c.name === name)) return;
    this.contacts.push({ name, phone });
    this.sortContacts();
  }

  deleteContact(name) {
    this.contacts = this.contacts.filter(c => c.name !== name);
  }

  updateContact(oldName, newName, newPhone) {
    const index = this.contacts.findIndex(c => c.name === oldName);
    if (index !== -1) {
      this.contacts[index] = { name: newName, phone: newPhone };
      this.sortContacts();
    }
  }

  getContacts() {
    return [...this.contacts];
  }

  addFromArray(array) {
    array.forEach(c => this.addContact(c.name, c.phone));
  }

  sortContacts() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  findContact(name) {
    const index = this.contacts.findIndex(c => c.name === name);
    return this.contacts[index] || null;
  }
}

export { Tree234, TreeNode234, ContactArray };
