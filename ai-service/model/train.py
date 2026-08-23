import os
import sys

def train_yolov8_road_damage():
    try:
        from ultralytics import YOLO

        model = YOLO('yolov8n.pt')

        dataset_yaml = os.path.join(os.path.dirname(__file__), 'road_damage_dataset.yaml')
        if not os.path.exists(dataset_yaml):
            yaml_content = """path: ./dataset
train: images/train
val: images/val

names:
  0: Pothole
  1: Longitudinal Crack
  2: Transverse Crack
  3: Alligator Crack
  4: Road Patch
"""
            with open(dataset_yaml, 'w') as f:
                f.write(yaml_content)

        print("Starting custom YOLOv8 Road Damage Model Training...")
        results = model.train(
            data=dataset_yaml,
            epochs=50,
            imgsz=640,
            batch=16,
            name='roadsense_yolov8_custom',
            project=os.path.join(os.path.dirname(__file__), 'runs')
        )
        print("Training completed. Weights saved to runs/roadsense_yolov8_custom/weights/best.pt")
        return results
    except Exception as e:
        print(f"YOLOv8 training error: {e}")
        return None

if __name__ == '__main__':
    train_yolov8_road_damage()
