"""
Training Script for Crop Disease Detection
You can run this script to train your own dataset!

Ensure you have your dataset organized in folders by class:
dataset/
    train/
        healthy/
        leaf_blight/
    val/
        healthy/
        leaf_blight/

Install requirements: pip install tensorflow
"""

import os
# Uncomment these when you are ready to train
# import tensorflow as tf
# from tensorflow.keras.preprocessing.image import ImageDataGenerator
# from tensorflow.keras.applications import MobileNetV2
# from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
# from tensorflow.keras.models import Model

def train_model(dataset_dir, epochs=10, batch_size=32):
    print("Preparing to train the model...")
    print(f"Dataset location: {dataset_dir}")
    
    # Example training pipeline (commented out until TF is installed):
    """
    train_datagen = ImageDataGenerator(rescale=1./255, rotation_range=20, zoom_range=0.15)
    train_generator = train_datagen.flow_from_directory(
        os.path.join(dataset_dir, 'train'),
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical'
    )
    
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    predictions = Dense(train_generator.num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    print("Training started...")
    model.fit(train_generator, epochs=epochs)
    
    model_save_path = '../saved_models/crop_disease_model.h5'
    model.save(model_save_path)
    print(f"Model saved to {model_save_path}")
    """
    print("Please uncomment the TensorFlow code in this script to train your model!")

if __name__ == "__main__":
    train_model(dataset_dir="path/to/your/dataset")
