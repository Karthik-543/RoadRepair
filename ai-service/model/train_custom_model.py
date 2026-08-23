import os
import cv2
import numpy as np
from ultralytics import YOLO

def build_sample_dataset(base_dir):
    images_train_dir = os.path.join(base_dir, 'images', 'train')
    images_val_dir = os.path.join(base_dir, 'images', 'val')
    labels_train_dir = os.path.join(base_dir, 'labels', 'train')
    labels_val_dir = os.path.join(base_dir, 'labels', 'val')

    os.makedirs(images_train_dir, exist_ok=True)
    os.makedirs(images_val_dir, exist_ok=True)
    os.makedirs(labels_train_dir, exist_ok=True)
    os.makedirs(labels_val_dir, exist_ok=True)

    for i in range(10):
        img = np.ones((640, 640, 3), dtype=np.uint8) * 120
        cv2.circle(img, (320, 320), 80, (40, 40, 40), -1)
        
        train_img_path = os.path.join(images_train_dir, f'sample_{i}.jpg')
        val_img_path = os.path.join(images_val_dir, f'sample_{i}.jpg')
        cv2.imwrite(train_img_path, img)
        cv2.imwrite(val_img_path, img)

        cls_id = i % 5
        label_content = f"{cls_id} 0.5 0.5 0.35 0.35\n"

        with open(os.path.join(labels_train_dir, f'sample_{i}.txt'), 'w') as f:
            f.write(label_content)
        with open(os.path.join(labels_val_dir, f'sample_{i}.txt'), 'w') as f:
            f.write(label_content)

    yaml_path = os.path.join(base_dir, 'road_damage.yaml')
    yaml_text = f"""path: {base_dir}
train: images/train
val: images/val

names:
  0: Pothole
  1: Longitudinal Crack
  2: Transverse Crack
  3: Alligator Crack
  4: Road Patch
"""
    with open(yaml_path, 'w') as f:
        f.write(yaml_text)

    return yaml_path

def train_and_save_best_model():
    model_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(model_dir, 'dataset_sample')
    yaml_config = build_sample_dataset(dataset_dir)

    print("Initializing YOLOv8 Neural Network training pipeline...")
    model = YOLO('yolov8n.pt')

    results = model.train(
        data=yaml_config,
        epochs=3,
        imgsz=640,
        batch=4,
        workers=1,
        project=os.path.join(model_dir, 'runs'),
        name='roadsense_yolov8_trained',
        exist_ok=True
    )

    trained_weights_path = os.path.join(model_dir, 'runs', 'roadsense_yolov8_trained', 'weights', 'best.pt')
    target_best_pt = os.path.join(model_dir, 'best.pt')

    if os.path.exists(trained_weights_path):
        import shutil
        shutil.copy(trained_weights_path, target_best_pt)
        print(f"Successfully trained and saved model weights to: {target_best_pt}")
    else:
        model.save(target_best_pt)
        print(f"Saved initial YOLOv8 weights to: {target_best_pt}")

if __name__ == '__main__':
    train_and_save_best_model()
