import os
import cv2
import numpy as np

def draw_bounding_boxes(image_path, output_path, boxes_data):
    if not os.path.exists(image_path):
        return False

    img = cv2.imread(image_path)
    if img is None:
        return False

    height, width, _ = img.shape

    color_map = {
        'Pothole': (0, 0, 235),
        'Alligator Crack': (0, 140, 255),
        'Longitudinal Crack': (0, 215, 255),
        'Transverse Crack': (255, 191, 0),
        'Road Patch': (50, 205, 50),
        'Undetected': (128, 128, 128)
    }

    for box in boxes_data:
        x1 = int(box.get('x1', width * 0.2))
        y1 = int(box.get('y1', height * 0.3))
        x2 = int(box.get('x2', width * 0.8))
        y2 = int(box.get('y2', height * 0.7))
        label = box.get('label', 'Pothole')
        conf = box.get('confidence', 0.85)

        color = color_map.get(label, (0, 0, 255))

        cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)

        text = f"{label}: {int(conf * 100)}%"
        (text_w, text_h), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        
        cv2.rectangle(img, (x1, y1 - text_h - 10), (x1 + text_w + 10, y1), color, -1)
        cv2.putText(img, text, (x1 + 5, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cv2.imwrite(output_path, img)
    return True
