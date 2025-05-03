import csv

class Node:
    def __init__(self, leaf):
        self.keys = []
        self.children = []
        self.leaf = leaf

class _234:
    def __init__(self):
        self.root = Node(True)
        self.contacts = {}  

    def chia_nho(self, parent, index, child):
        new_node = Node(child.leaf)
        mid = child.keys[1]

        new_node.keys = child.keys[2:]
        child.keys = child.keys[:1]

        if not child.leaf:
            new_node.children = child.children[2:]
            child.children = child.children[:2]

        parent.keys.insert(index, mid) 
        parent.children.insert(index + 1, new_node)  

    def chen(self, name, phone):
        self.contacts[name] = phone 
        root = self.root
        new_contact = (name, phone)

        if len(root.keys) == 3:
            new_root = Node(False)
            new_root.children.append(self.root)
            self.chia_nho(new_root, 0, root)
            self.root = new_root

        self.chen_notfull(self.root, new_contact)

    def chen_notfull(self, node, contact):
        if node.leaf:
            node.keys.append(contact)
            node.keys.sort()
        else:
            index = len(node.keys) - 1
            while index >= 0 and contact[0] < node.keys[index][0]:
                index -= 1
            index += 1

            if len(node.children[index].keys) == 3:
                self.chia_nho(node, index, node.children[index])
                if contact[0] > node.keys[index][0]:
                    index += 1

            self.chen_notfull(node.children[index], contact)

    def duyet(self, node=None):
        if node is None:
            node = self.root
        for i in range(len(node.keys)):
            if not node.leaf:
                self.duyet(node.children[i])
            name = node.keys[i][0]
            print(f"{name}: {self.contacts[name]}")  # 🔹 In đúng thông tin từ dict
        if not node.leaf:
            self.duyet(node.children[-1])


    def tim_kiem(self, name, node=None):
        if node is None:
            node = self.root

        i = 0
        while i < len(node.keys) and name > node.keys[i][0]:
            i += 1

        if i < len(node.keys) and node.keys[i][0] == name:
            return self.contacts.get(name, "Không tìm thấy số điện thoại")

        if node.leaf:
            return "Không tìm thấy trong danh bạ"

        return self.tim_kiem(name, node.children[i])

tree = _234()

with open(r"C:\university\ctdl\project\contacts.csv", newline="", encoding="utf-8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)  # Bỏ dòng tiêu đề
    for name, phone in reader:
        tree.chen(name, phone)

print(" Danh bạ:")
tree.duyet()

while True:
    ten_can_tim = input("\n🔍 Nhập tên cần tìm (hoặc nhập 'exit' để thoát): ")
    if ten_can_tim.lower() == "exit":
        break
    ket_qua = tree.tim_kiem(ten_can_tim)
    print(f"🔍 Kết quả tìm kiếm: {ten_can_tim} → {ket_qua}")