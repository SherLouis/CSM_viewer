import json

data = dict()

with open('base_effects.json', 'r') as jsonfile:
    data = json.load(jsonfile)

results = []

for eclass in data:
    class_name = eclass["name"]
    results.append({'level': 'class', 'class': class_name, 'descriptor': '', 'details':''})
    for descriptor in eclass["children"]:
        descriptor_name = descriptor["name"]
        results.append({'level': 'descriptor', 'class': class_name, 'descriptor': descriptor_name, 'details':''})
        for details in descriptor["children"]:
            detail_name = details["name"]
            results.append({'level': 'details', 'class': class_name, 'descriptor': descriptor_name, 'details':detail_name})
            

print(json.dumps(results))