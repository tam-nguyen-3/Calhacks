"""Welcome to Reflex! This file outlines the steps to create a basic app."""
from rxconfig import config

import reflex as rx
import asyncio
import os
from typing import List

# Selection menu state
options: List[str] = ["Option 1", "Option 2", "Option 3"]

# Main State
class State(rx.State):
    # test selection
    option: str = "No selection yet."

    """The app state."""
    # The upload picture state ----
    # Whether we are currently uploading files.
    is_uploading: bool

    # list of image to show
    img: list[str]

    @rx.var
    def file_str(self) -> str:
        """Get the string representation of the uploaded files."""
        return "\n".join(os.listdir(rx.get_asset_path()))

    async def handle_upload(self, files: List[rx.UploadFile]):
        """Handle the file upload."""
        self.is_uploading = True

        # Iterate through the uploaded files.
        for file in files:
            upload_data = await file.read()
            outfile = rx.get_asset_path(file.filename)

            # save the file
            with open(outfile, "wb") as file_object:
                file_object.write(upload_data)

            self.img.append(file.filename)

        # Stop the upload.
        return State.stop_upload

    async def stop_upload(self):
        """Stop the file upload."""
        await asyncio.sleep(1)
        self.is_uploading = False


def navbar():
    return rx.box(
        rx.hstack(
            # rx.image(src="favicon.ico"),
            rx.heading("OKOK"),
        ),
        position="fixed",
        width="100%",
        top="0px",
        z_index="5",
    )

color = "rgb(107,99,246)"

def upload() -> rx.Component:
    """The main view."""
    return rx.vstack(
        # dropdown menu
        select(),

        # upload component
        rx.upload(
            rx.vstack(
                rx.button(
                    "Select File",
                    color=color,
                    bg="white",
                    border=f"1px solid {color}",
                ),
                rx.text(
                    "Drag and drop files here or click to select files"
                ),
                rx.hstack(
                    rx.button(
                        "Upload",
                        on_click=lambda: State.handle_upload(
                            rx.upload_files()
                        ),
                    ),
                    rx.button(
                        "Clear",
                        on_click=rx.clear_selected_files,
                    ),
                )
            ),
            multiple=True,
            accept={
                "application/pdf": [".pdf"],
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/gif": [".gif"],
                "image/webp": [".webp"],
                "text/html": [".html", ".htm"],
            },
            max_files=5,
            disabled=False,
            on_keyboard=True,
            border=f"1px dotted {color}",
            padding="5em",
        ),
        rx.hstack(rx.foreach(rx.selected_files, rx.text)),

        rx.responsive_grid(
            rx.foreach(
                State.img,
                lambda img: rx.vstack(
                    rx.image(src=img),
                    rx.text(img),
                ),
            ),
            columns=[2],
            spacing="5px",
        ),
        padding="5em",
    )

def select() -> rx.Component:
    return rx.vstack(
        rx.select(
            options,
            placeholder="Select an example.",
            on_change=State.set_option,
            color_schemes="twitter",
        ),
    )

def index() -> rx.Component:
    return rx.box(
        upload(),
    )


# Add state and page to the app.
app = rx.App()
app.add_page(index)
app.compile()
